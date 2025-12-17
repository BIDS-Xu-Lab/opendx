"""
API server for clinical case management with streaming support.
"""
import json
import asyncio
import uuid
from typing import Optional, Annotated
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from redis import Redis
from rq import Queue
from sqlmodel import select
import database
from sqlmodel import Session
from auth import get_current_user, get_user_id


app = FastAPI(title="Clinical Case Management API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for job queue
redis_conn = Redis(host='localhost', port=6379, db=0)
job_queue = Queue('clinical_cases', connection=redis_conn)


# Pydantic models for request/response validation
class HealthResponse(BaseModel):
    status: str


class CreateCaseRequest(BaseModel):
    question: str = Field(..., description="Patient question or case description")
    title: Optional[str] = Field(None, description="Optional case title")


class CreateCaseResponse(BaseModel):
    case_id: str
    status: str
    title: str
    created_at: str
    job_id: str


class CaseResponse(BaseModel):
    case_id: str
    status: str
    title: Optional[str]
    messages: list
    evidence_snippets: list
    created_at: str
    updated_at: str


class CaseListItem(BaseModel):
    case_id: str
    status: str
    title: Optional[str]
    created_at: str
    updated_at: str


class CaseListResponse(BaseModel):
    cases: list[CaseListItem]
    


def get_session():
    """
    FastAPI dependency that provides a database session.
    The session is automatically committed and closed after the request.
    """
    with Session(database.engine) as session:
        yield session


# Type alias for FastAPI dependency injection
# This combines the type hint and dependency in one annotation
SessionDep = Annotated[Session, Depends(get_session)]


@app.get('/api/health', response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post('/api/create_case', response_model=CreateCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case_endpoint(
    request: CreateCaseRequest,
    db: SessionDep,
    user_id: str = Depends(get_user_id)
):
    """
    Create a new clinical case and enqueue processing job.

    Request body:
    - question: Patient question or case description (required)
    - title: Optional case title

    Response:
    - case_id: Unique identifier for the case
    - status: Current status (CREATED)
    - title: Case title
    - created_at: ISO timestamp
    - job_id: Job queue identifier

    Requires authentication via JWT token.
    """
    question = request.question
    title = request.title or (question[:100] if question else "Untitled Case")

    # Generate unique case ID
    case_id = str(uuid.uuid4())

    # Create case in database with user_id
    case = database.create_case(db, case_id, user_id, title)

    # Enqueue job for processing
    job = job_queue.enqueue(
        'worker.process_case',
        case_id=case_id,
        user_id=user_id,
        question=question,
        job_timeout='10m'
    )

    return CreateCaseResponse(
        case_id=case.case_id,
        status=case.status,
        title=case.data_json.get("title"),
        created_at=case.created_at.isoformat(),
        job_id=job.id
    )


@app.get('/api/cases/{case_id}', response_model=CaseResponse)
async def get_case_endpoint(
    case_id: str,
    db: SessionDep,
    user_id: str = Depends(get_user_id)
):
    """
    Get full case data including all messages and evidence snippets.

    Response:
    - case_id: Unique identifier
    - status: CREATED|PROCESSING|COMPLETED|ERROR
    - title: Case title
    - messages: List of messages
    - evidence_snippets: List of evidence snippets
    - created_at: ISO timestamp
    - updated_at: ISO timestamp

    Requires authentication via JWT token.
    Only returns cases belonging to the authenticated user.
    """
    case_data = database.get_case_full(db, case_id, user_id)

    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found")

    return case_data


@app.get('/api/cases/{case_id}/stream')
async def stream_case_endpoint(
    case_id: str,
    token: Optional[str] = None,
):
    """
    Server-Sent Events endpoint for streaming case updates.

    This endpoint keeps the connection open and sends new messages
    as they are added to the database by the worker.

    SSE format:
    data: {"type": "message", "data": {...}}

    data: {"type": "status", "status": "COMPLETED"}

    Note: We don't use SessionDep here because the session would close
    before the generator finishes. Instead, we create a new session for
    each database query.

    Requires authentication via JWT token (passed as query parameter 'token').
    Only streams cases belonging to the authenticated user.

    EventSource doesn't support custom headers, so the token must be passed
    as a query parameter.
    """
    # Authenticate using query parameter token
    from auth import verify_jwt_token
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    try:
        payload = verify_jwt_token(token)
        user_id = payload["sub"]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    async def generate():
        # Verify case exists and belongs to user
        from sqlmodel import Session
        with Session(database.engine) as db:
            case = database.get_case(db, case_id, user_id)
            if not case:
                yield f"data: {json.dumps({'type': 'error', 'message': 'Case not found'})}\n\n"
                return

            # Send initial status
            yield f"data: {json.dumps({'type': 'status', 'status': case.status})}\n\n"

        last_message_id = None
        max_iterations = 300  # 5 minutes max (300 * 1 second)
        iteration = 0

        while iteration < max_iterations:
            # Create a new session for each iteration
            with Session(database.engine) as db:
                # Get case status
                case = database.get_case(db, case_id, user_id)
                if not case:
                    break

                # Get new messages since last check (filtered by user_id)
                new_messages = database.get_new_messages(db, case_id, user_id, last_message_id)

                # Send new messages
                for msg in new_messages:
                    yield f"data: {json.dumps({'type': 'message', 'data': msg})}\n\n"
                    last_message_id = msg['message_id']

                # Send status update
                yield f"data: {json.dumps({'type': 'status', 'status': case.status})}\n\n"

                # If case is completed or errored, send final event and close
                if case.status in ['COMPLETED', 'ERROR']:
                    yield f"data: {json.dumps({'type': 'done', 'status': case.status})}\n\n"
                    break

            # Wait before next check
            await asyncio.sleep(1)
            iteration += 1

        # Timeout or completion
        if iteration >= max_iterations:
            yield f"data: {json.dumps({'type': 'timeout'})}\n\n"

    return StreamingResponse(
        generate(),
        media_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    )


@app.get('/api/cases', response_model=CaseListResponse)
async def list_cases_endpoint(
    db: SessionDep,
    user_id: str = Depends(get_user_id)
):
    """
    List all cases for the authenticated user.

    Response:
    - cases: List of case summaries

    Requires authentication via JWT token.
    Only returns cases belonging to the authenticated user.
    """
    cases = database.get_cases(db, user_id, limit=50)
    return CaseListResponse(
        cases=[CaseListItem(**case.to_dict()) for case in cases]
    )


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
