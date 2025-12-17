"""
Database models and connection for clinical case tracking.
Uses SQLModel (SQLAlchemy + Pydantic) with PostgreSQL (Supabase).
"""
from datetime import datetime
from typing import Optional, Annotated, Any
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship, create_engine, Session, select
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL
database_url = os.getenv("DATABASE_URL")

engine = create_engine(
    database_url,
    echo=False,  # Set to True for debugging
    pool_pre_ping=True,  # Test connections before using them
    pool_size=5,  # Number of connections to maintain
    max_overflow=10,  # Maximum number of connections to create beyond pool_size
    pool_recycle=3600,  # Recycle connections after 1 hour
)
print("* created database engine")


class ClinicalCase(SQLModel, table=True):
    """Model for tracking a clinical case."""
    __tablename__ = "cases"

    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str = Field(unique=True, index=True)
    user_id: str = Field(index=True)  # Supabase user ID
    status: str = Field(default="CREATED")  # CREATED, PROCESSING, COMPLETED, ERROR
    data_json: dict = Field(default_factory=dict, sa_column=Column(JSON))  # Contains: title, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    messages: list["Message"] = Relationship(back_populates="case", cascade_delete=True)
    evidence_snippets: list["EvidenceSnippet"] = Relationship(back_populates="case", cascade_delete=True)

    def to_dict(self) -> dict:
        return {
            "case_id": self.case_id,
            "status": self.status,
            "title": self.data_json.get("title") if isinstance(self.data_json, dict) else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class Message(SQLModel, table=True):
    """Model for tracking a message in a case."""
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    message_id: str = Field(unique=True, index=True)
    case_id: str = Field(foreign_key="cases.case_id", index=True)
    user_id: str = Field(index=True)  # Supabase user ID
    message_data_json: dict = Field(default_factory=dict, sa_column=Column(JSON))  # Contains: from_id, message_type, text, payload_json, stage
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    case: Optional[ClinicalCase] = Relationship(back_populates="messages")

    def to_dict(self) -> dict:
        return {
            "message_id": self.message_id,
            "case_id": self.case_id,
            "from_id": self.message_data_json.get("from_id") if isinstance(self.message_data_json, dict) else None,
            "message_type": self.message_data_json.get("message_type") if isinstance(self.message_data_json, dict) else None,
            "text": self.message_data_json.get("text") if isinstance(self.message_data_json, dict) else None,
            "payload_json": self.message_data_json.get("payload_json") if isinstance(self.message_data_json, dict) else None,
            "stage": self.message_data_json.get("stage") if isinstance(self.message_data_json, dict) else None,
            "created_at": self.created_at.isoformat(),
        }


class EvidenceSnippet(SQLModel, table=True):
    """Model for tracking evidence snippets in a case."""
    __tablename__ = "evidence_snippets"

    id: Optional[int] = Field(default=None, primary_key=True)
    snippet_id: str = Field(unique=True, index=True)
    case_id: str = Field(foreign_key="cases.case_id", index=True)
    snippet_data_json: dict = Field(default_factory=dict, sa_column=Column(JSON))  # Contains: text, source_id, source_type, source_url, source_citation, index
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    case: Optional[ClinicalCase] = Relationship(back_populates="evidence_snippets")

    def to_dict(self) -> dict:
        return {
            "snippet_id": self.snippet_id,
            "case_id": self.case_id,
            "index": self.snippet_data_json.get("index", 0) if isinstance(self.snippet_data_json, dict) else 0,
            "text": self.snippet_data_json.get("text") if isinstance(self.snippet_data_json, dict) else None,
            "source_id": self.snippet_data_json.get("source_id") if isinstance(self.snippet_data_json, dict) else None,
            "source_type": self.snippet_data_json.get("source_type") if isinstance(self.snippet_data_json, dict) else None,
            "source_url": self.snippet_data_json.get("source_url") if isinstance(self.snippet_data_json, dict) else None,
            "source_citation": self.snippet_data_json.get("source_citation") if isinstance(self.snippet_data_json, dict) else None,
            "created_at": self.created_at.isoformat(),
        }


def init_db():
    """Initialize database tables."""
    SQLModel.metadata.create_all(engine, checkfirst=True)


def create_case(db: Session, case_id: str, user_id: str, title: str = None) -> ClinicalCase:
    """Create a new clinical case."""
    case = ClinicalCase(
        case_id=case_id,
        user_id=user_id,
        status="CREATED",
        data_json={"title": title}
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    # Make a copy of the data to avoid detached instance issues
    case_dict = {
        "case_id": case.case_id,
        "user_id": case.user_id,
        "status": case.status,
        "data_json": case.data_json,
        "created_at": case.created_at,
        "updated_at": case.updated_at,
        "id": case.id
    }
    db.expunge(case)
    return case


def get_case(db: Session, case_id: str, user_id: str = None) -> Optional[ClinicalCase]:
    """Get a clinical case by ID, optionally filtered by user_id."""
    statement = select(ClinicalCase).where(ClinicalCase.case_id == case_id)
    if user_id:
        statement = statement.where(ClinicalCase.user_id == user_id)
    case = db.exec(statement).first()
    if case:
        # Access attributes to load them before session closes
        _ = case.case_id
        _ = case.user_id
        _ = case.status
        _ = case.data_json
        _ = case.created_at
        _ = case.updated_at
        db.expunge(case)
    return case


def update_case_status(db: Session, case_id: str, status: str):
    """Update the status of a case."""
    statement = select(ClinicalCase).where(ClinicalCase.case_id == case_id)
    case = db.exec(statement).first()
    if case:
        case.status = status
        case.updated_at = datetime.utcnow()
        db.add(case)
        db.commit()


def add_message(db: Session, case_id: str, user_id: str, message_id: str, message_data: dict):
    """Add a message to a case."""
    message = Message(
        message_id=message_id,
        case_id=case_id,
        user_id=user_id,
        message_data_json=message_data
    )
    db.add(message)
    db.commit()


def add_evidence_snippet(db: Session, case_id: str, snippet_id: str, snippet_data: dict):
    """Add an evidence snippet to a case."""
    snippet = EvidenceSnippet(
        snippet_id=snippet_id,
        case_id=case_id,
        snippet_data_json=snippet_data
    )
    db.add(snippet)
    db.commit()


def get_case_full(db: Session, case_id: str, user_id: str = None) -> Optional[dict]:
    """Get full case data including messages and evidence snippets, optionally filtered by user_id."""
    statement = select(ClinicalCase).where(ClinicalCase.case_id == case_id)
    if user_id:
        statement = statement.where(ClinicalCase.user_id == user_id)
    case = db.exec(statement).first()
    if not case:
        return None

    # Get messages
    messages_statement = select(Message).where(Message.case_id == case_id).order_by(Message.created_at)
    if user_id:
        messages_statement = messages_statement.where(Message.user_id == user_id)
    messages = db.exec(messages_statement).all()

    # Get snippets
    snippets_statement = select(EvidenceSnippet).where(EvidenceSnippet.case_id == case_id).order_by(EvidenceSnippet.created_at)
    snippets = db.exec(snippets_statement).all()

    return {
        "case_id": case.case_id,
        "status": case.status,
        "title": case.data_json.get("title") if isinstance(case.data_json, dict) else None,
        "messages": [msg.to_dict() for msg in messages],
        "evidence_snippets": [snip.to_dict() for snip in snippets],
        "created_at": case.created_at.isoformat(),
        "updated_at": case.updated_at.isoformat(),
    }


def get_new_messages(db: Session, case_id: str, user_id: str = None, since_message_id: str = None) -> list:
    """Get new messages for a case since a given message ID, optionally filtered by user_id."""
    statement = select(Message).where(Message.case_id == case_id)
    if user_id:
        statement = statement.where(Message.user_id == user_id)

    if since_message_id:
        # Get messages created after the specified message
        since_statement = select(Message).where(Message.message_id == since_message_id)
        since_msg = db.exec(since_statement).first()
        if since_msg:
            statement = statement.where(Message.created_at > since_msg.created_at)

    statement = statement.order_by(Message.created_at)
    messages = db.exec(statement).all()
    return [msg.to_dict() for msg in messages]


def get_cases(db: Session, user_id: str = None, limit: int = 50) -> list[ClinicalCase]:
    """Get a list of cases ordered by creation time, optionally filtered by user_id."""
    statement = select(ClinicalCase)
    if user_id:
        statement = statement.where(ClinicalCase.user_id == user_id)
    statement = statement.order_by(ClinicalCase.created_at.desc()).limit(limit)
    cases = db.exec(statement).all()
    return cases
