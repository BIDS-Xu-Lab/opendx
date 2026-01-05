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
            "case_description": case_text,
            "predictions": [
                "Infectious Conditions",
                "Cervical spine hardware failure with associated prevertebral soft tissue injury",
                "Contained esophageal microperforation with secondary prevertebral abscess"
            ],
            "warning_diagnosis": [
                "Retropharyngeal abscess",
                "Epiglottitis",
                "Peritonsillar abscess"
            ],
            "reasoning": [
                {
                    "reasoning": "The patient's presentation of odynophagia, anterior neck tenderness, fever, leukocytosis, and elevated lactate, combined with imaging findings of a rim-enhancing prevertebral fluid collection and hardware displacement, strongly supports a diagnosis of a prevertebral abscess related to cervical spine hardware infection. The presence of gas locules and inflammatory changes extending into adjacent spaces further confirms deep neck infection. Surgical drainage and culture results identifying oral flora organisms are consistent with hardware-associated infectious complications requiring multidisciplinary management.",
                    "references": [
                        "A complex presentation of complicated secondary syphilis with ulcerated lesion progression."
                    ]
                },
                {
                    "reasoning": "The patient\u2019s presentation of odynophagia, anterior neck tenderness, fever, and elevated inflammatory markers alongside imaging revealing prevertebral fluid collection and hardware displacement strongly supports cervical spine hardware failure complicated by a prevertebral abscess. The history of anterior cervical fusion and imaging findings of screw retraction with associated soft tissue inflammation are consistent with hardware-related soft tissue injury and infection, as described in similar cases of late hardware complications leading to prevertebral abscess formation and the need for surgical intervention [2,3,5].",
                    "references": [
                        "Esophagopharyngeal perforation and prevertebral abscess after anterior cervical discectomy and fusion: a case report.",
                        "The new onset of dysphagia four years after anterior cervical discectomy and fusion: Case report and literature review.",
                        "Late prevertebral abscess following anterior cervical plating: the missing screw."
                    ]
                },
                {
                    "reasoning": "The patient's presentation of odynophagia, anterior neck tenderness, fever, and leukocytosis alongside imaging revealing a rim-enhancing prevertebral fluid collection with gas locules and hardware displacement strongly suggests a deep neck infection secondary to a contained esophageal microperforation. The absence of vertebral destruction or spinal canal involvement on MRI and negative esophagram for leak indicate a localized perforation leading to abscess formation. Surgical findings of soft tissue defect and polymicrobial cultures further support this diagnosis, consistent with complications from prior cervical spine hardware.",
                    "references": []
                }
            ],
            "overall_reasoning": "This patient's presentation of odynophagia, anterior neck tenderness, fever, leukocytosis, and elevated lactate, combined with imaging findings of a rim-enhancing prevertebral fluid collection with gas locules and cervical hardware displacement, strongly supports a diagnosis of a prevertebral abscess related to cervical spine hardware infection and failure. The history of anterior cervical fusion and imaging evidence of screw retraction with surrounding inflammatory changes confirm hardware failure complicated by prevertebral soft tissue injury and infection, necessitating surgical intervention. Although a contained esophageal microperforation with secondary prevertebral abscess is plausible given the soft tissue defect and polymicrobial cultures, the absence of direct evidence of esophageal perforation on nasopharyngeal scope and esophagram weakens this diagnosis. The broad category of infectious conditions is well supported by clinical, laboratory, imaging, surgical, and microbiological findings but is less specific than the hardware-related abscess diagnosis. Importantly, warning diagnoses such as retropharyngeal abscess, epiglottitis, and peritonsillar abscess are less likely given the lack of posterior oropharyngeal abnormalities, airway compromise, or typical clinical features, and imaging findings localize the infection to the prevertebral space rather than these other deep neck spaces. Overall, the constellation of clinical and imaging findings, surgical observations, and culture results confirm a deep neck infection secondary to cervical spine hardware failure with associated prevertebral abscess formation, with a possible but unconfirmed esophageal microperforation as the source.\nReferences: \n[1] Esophagopharyngeal perforation and prevertebral abscess after anterior cervical discectomy and fusion: a case report.\n [2] The new onset of dysphagia four years after anterior cervical discectomy and fusion: Case report and literature review.\n [3] Late prevertebral abscess following anterior cervical plating: the missing screw.\n [4] A complex presentation of complicated secondary syphilis with ulcerated lesion progression.",
            "management": "This patient requires urgent multidisciplinary management addressing the infected cervical spine hardware with associated prevertebral abscess and possible contained esophageal microperforation. Initial steps include close monitoring of vital signs and neurological status, broad-spectrum intravenous antibiotics tailored to culture results, and supportive care including analgesia and glycemic control. Imaging with contrast-enhanced CT and MRI should be used to delineate the extent of infection, hardware displacement, and to exclude vertebral or spinal canal involvement. Surgical intervention is mandatory, involving irrigation and drainage of the prevertebral abscess, removal of the infected cervical hardware, and repair of any soft tissue defects identified intraoperatively. Intraoperative cultures must be obtained to guide antimicrobial therapy. Esophageal evaluation with fluoroscopic esophagram and esophagogastroduodenoscopy (EGD) should be performed to detect and monitor any microperforation; repeat imaging and endoscopy may be necessary. Postoperatively, the patient should be admitted to ICU for close monitoring, continued intravenous antibiotics via a peripherally inserted central catheter (PICC), and multidisciplinary follow-up with neurosurgery, otolaryngology, infectious disease, and gastroenterology. Serial clinical and imaging assessments are essential to ensure resolution of infection and to detect any complications early.",
            "actions": [
                "1. Obtain detailed history focusing on symptom onset, progression, and risk factors for deep neck infections. 2. Perform thorough physical examination emphasizing neck tenderness, swelling, airway patency, and neurological status. 3. Repeat vital signs monitoring to detect fever and hemodynamic changes. 4. Order laboratory tests including complete blood count with differential, inflammatory markers (CRP, ESR), blood cultures, and serum lactate. 5. Acquire imaging studies: start with soft tissue neck radiograph to assess prevertebral soft tissue swelling and hardware position. 6. Perform contrast-enhanced CT scan of the neck to identify fluid collections, abscess formation, gas locules, hardware displacement, and extent of infection. 7. Conduct MRI of the cervical spine to evaluate soft tissue involvement, vertebral body integrity, and spinal canal status. 8. Utilize bedside nasopharyngoscopy to exclude mucosal lesions or pharyngeal sources of infection. 9. Perform fluoroscopic esophagram to rule out esophageal perforation or leak. 10. Obtain surgical exploration with irrigation and drainage of the fluid collection and removal of infected hardware if indicated. 11. Collect intraoperative cultures and send for aerobic, anaerobic, and fungal cultures to identify causative organisms. 12. Correlate clinical, laboratory, imaging, surgical, and microbiological findings to confirm diagnosis of prevertebral abscess related to hardware infection.",
                "1. Obtain detailed comparison of current and prior cervical spine imaging (X-ray, CT) to assess hardware position, loosening, or breakage. 2. Perform contrast-enhanced CT of the neck to identify fluid collections, inflammatory changes, and gas locules around hardware. 3. Conduct MRI of the cervical spine to evaluate soft tissue involvement, vertebral body integrity, and spinal canal status. 4. Perform bedside nasopharyngeal endoscopy to exclude mucosal lesions or fistula. 5. Conduct fluoroscopic esophagram to rule out esophageal perforation or leak. 6. Obtain intraoperative assessment during hardware removal to directly visualize hardware integrity and soft tissue defects. 7. Collect and culture fluid/tissue samples from the prevertebral space to identify infectious organisms. 8. Correlate clinical signs (fever, elevated WBC, rigors, neck tenderness) with imaging and surgical findings to confirm diagnosis of hardware failure with associated prevertebral soft tissue injury.",
                "1. Perform a dedicated esophagogastroduodenoscopy (EGD) to directly visualize the esophageal mucosa for microperforations or defects. 2. Repeat a contrast esophagram using water-soluble contrast under fluoroscopy to detect subtle or intermittent esophageal leaks. 3. Obtain an esophageal CT with oral contrast to identify extravasation of contrast material indicating perforation. 4. During surgical exploration, carefully inspect and document any esophageal wall defects or perforations, with biopsy or culture of suspicious tissue if feasible. 5. Consider endoscopic ultrasound (EUS) to assess esophageal wall integrity and adjacent soft tissue involvement. 6. Correlate intraoperative findings with microbiology cultures to identify organisms typical of esophageal flora. 7. Monitor serial imaging post-intervention to confirm resolution or persistence of any esophageal leak or abscess."
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
