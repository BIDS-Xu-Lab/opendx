"""
API server for clinical case management with streaming support.
"""
import json
import asyncio
import uuid
import os
from typing import Optional, Annotated, AsyncGenerator
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlmodel import select
import database
from sqlmodel import Session
from auth import get_current_user, get_user_id, get_optional_user_id
import httpx
from sse_starlette import EventSourceResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


app = FastAPI(title="OpenDx API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get agent service URL from environment
AGENT_SERVICE_URL = os.getenv("AGENT_SERVICE_URL", "http://localhost:8000")
USE_MOCK_CHAT = os.getenv("USE_MOCK_CHAT", "false").lower() == "true"


# Database session dependency
def get_db():
    """Get database session."""
    with Session(database.engine) as session:
        yield session


# Request/Response models
class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    case_text: str = Field(..., min_length=1, description="Clinical case text")


class HistoryResponse(BaseModel):
    """Response model for history endpoint."""
    cases: list[dict]


async def mock_event_generator(case_id: str, case_text: str, user_id: Optional[str], db: Session) -> AsyncGenerator[str, None]:
    """
    Mock event generator that simulates agent responses without calling the AI model.
    Returns similar output format for development/testing.
    """
    message_id_user = str(uuid.uuid4())

    try:
        # Only save to database if user is authenticated
        if user_id:
            # Create case in database
            database.create_case(db, case_id=case_id, user_id=user_id, title=case_text[:100])
            database.update_case_status(db, case_id=case_id, status="PROCESSING")

            # Save user message
            database.add_message(
                db,
                case_id=case_id,
                user_id=user_id,
                message_id=message_id_user,
                message_data={
                    "from_id": user_id,
                    "message_type": "USER",
                    "text": case_text,
                    "stage": "final"
                }
            )

        # Emit initial event with case_id
        yield json.dumps({'type': 'case_created', 'case_id': case_id})

        # Simulate progress events
        progress_stages = [
            "Analyzing clinical presentation...",
            "Searching literature about [<diagnosis_1>]...",
            "Searching literature about [<diagnosis_2>]...",
            "Identifying key symptoms...",
            "Reviewing differential diagnoses...",
            "Evaluating evidence...",
            "Generating recommendations...",
            "Finalizing analysis..."
        ]

        for stage in progress_stages:
            await asyncio.sleep(1.5)  # Simulate processing time
            yield json.dumps({'type': 'progress', 'message': stage})

        # Generate mock result
        mock_result = {
            "overall_reasoning": f"Mock analysis of the clinical case: {case_text[:100]}... This is a simulated response for development purposes.",
            "differential_diagnoses": [
                {
                    "diagnosis": "Mock Diagnosis 1",
                    "probability": "High",
                    "reasoning": "This is a mock diagnosis based on the clinical presentation."
                },
                {
                    "diagnosis": "Mock Diagnosis 2",
                    "probability": "Medium",
                    "reasoning": "This is an alternative mock diagnosis to consider."
                }
            ],
            "recommended_tests": [
                "Mock Lab Test 1",
                "Mock Imaging Study"
            ],
            "red_flags": [
                "This is a mock response - replace with real implementation for production use"
            ]
        }

        # Save agent response message (only if authenticated)
        if user_id:
            message_id_agent = str(uuid.uuid4())
            database.add_message(
                db,
                case_id=case_id,
                user_id=user_id,
                message_id=message_id_agent,
                message_data={
                    "from_id": "agent",
                    "message_type": "AGENT",
                    "text": mock_result.get("overall_reasoning", ""),
                    "payload_json": mock_result,
                    "stage": "final"
                }
            )

            # Update case status
            database.update_case_status(db, case_id=case_id, status="COMPLETED")

        # Send result event
        yield json.dumps({'type': 'result', 'data': mock_result})

    except Exception as e:
        error_msg = f"Mock error: {str(e)}"
        yield json.dumps({'type': 'error', 'message': error_msg})
        if user_id:
            database.update_case_status(db, case_id=case_id, status="ERROR")


@app.get('/api/health')
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post('/api/chat')
async def chat(
    request: ChatRequest,
    user_id: Optional[str] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    """
    Chat endpoint with SSE streaming.
    Accepts clinical case text, calls agent service (or mock), and streams responses.
    Works for both authenticated and anonymous users.
    Anonymous users can chat but their history won't be saved.
    Set USE_MOCK_CHAT=true in environment to use mock implementation.
    """
    # Use mock implementation if enabled
    if USE_MOCK_CHAT:
        case_id = str(uuid.uuid4())
        return EventSourceResponse(mock_event_generator(case_id, request.case_text, user_id, db))

    # Real implementation
    async def event_generator() -> AsyncGenerator[str, None]:
        case_id = str(uuid.uuid4())
        message_id_user = str(uuid.uuid4())

        try:
            # Only save to database if user is authenticated
            if user_id:
                # Create case in database
                database.create_case(db, case_id=case_id, user_id=user_id, title=request.case_text[:100])
                database.update_case_status(db, case_id=case_id, status="PROCESSING")

                # Save user message
                database.add_message(
                    db,
                    case_id=case_id,
                    user_id=user_id,
                    message_id=message_id_user,
                    message_data={
                        "from_id": user_id,
                        "message_type": "USER",
                        "text": request.case_text,
                        "stage": "final"
                    }
                )

            # Emit initial event with case_id
            yield f"data: {json.dumps({'type': 'case_created', 'case_id': case_id})}\n\n"

            # Call agent service with streaming
            agent_url = f"{AGENT_SERVICE_URL}/chat"
            agent_payload = {
                "messages": [
                    {
                        "role": "user",
                        "content": request.case_text
                    }
                ]
            }

            # Store result data when received
            result_data = None

            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream('POST', agent_url, json=agent_payload) as response:
                    if response.status_code != 200:
                        error_msg = f"Agent service error: {response.status_code}"
                        yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
                        database.update_case_status(db, case_id=case_id, status="ERROR")
                        return

                    # Stream response from agent
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]  # Remove "data: " prefix
                            try:
                                data = json.loads(data_str)

                                # Forward progress events
                                if data.get("type") == "progress":
                                    yield f"data: {json.dumps(data)}\n\n"

                                # Handle result event
                                elif data.get("type") == "result":
                                    result_data = data.get("data", {})

                                    # Save agent response message (only if authenticated)
                                    if user_id:
                                        message_id_agent = str(uuid.uuid4())
                                        database.add_message(
                                            db,
                                            case_id=case_id,
                                            user_id=user_id,
                                            message_id=message_id_agent,
                                            message_data={
                                                "from_id": "agent",
                                                "message_type": "AGENT",
                                                "text": result_data.get("overall_reasoning", ""),
                                                "payload_json": result_data,
                                                "stage": "final"
                                            }
                                        )

                                        # Update case status
                                        database.update_case_status(db, case_id=case_id, status="COMPLETED")

                                    # Forward result to frontend
                                    yield f"data: {json.dumps(data)}\n\n"

                            except json.JSONDecodeError:
                                # Skip non-JSON lines
                                continue

        except httpx.TimeoutException:
            error_msg = "Agent service timeout"
            yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
            if user_id:
                database.update_case_status(db, case_id=case_id, status="ERROR")
        except httpx.RequestError as e:
            error_msg = f"Agent service unreachable: {str(e)}"
            yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
            if user_id:
                database.update_case_status(db, case_id=case_id, status="ERROR")
        except Exception as e:
            error_msg = f"Internal error: {str(e)}"
            yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
            if user_id:
                database.update_case_status(db, case_id=case_id, status="ERROR")

    return EventSourceResponse(event_generator())


@app.get('/api/history')
async def get_history(
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db)
) -> HistoryResponse:
    """
    Get all cases for the authenticated user.
    """
    cases = database.get_cases(db, user_id=user_id, limit=100)
    return HistoryResponse(
        cases=[case.to_dict() for case in cases]
    )


@app.get('/api/cases/{case_id}/full')
async def get_case_full(
    case_id: str,
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db)
):
    """
    Get full case data including messages and evidence snippets.
    Only returns cases owned by the authenticated user.
    """
    case_data = database.get_case_full(db, case_id=case_id, user_id=user_id)

    if not case_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found or you don't have access to this case"
        )

    return case_data


def main():
    """Initialize database and run server."""
    import uvicorn

    database.init_db()
    print("Database initialized")
    print("Starting server on http://localhost:5000")

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=9627,
        reload=True
    )


if __name__ == '__main__':
    main()
