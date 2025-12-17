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
from sqlmodel import select
import database
from sqlmodel import Session
from auth import get_current_user, get_user_id


app = FastAPI(title="OpenDx API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/api/health')
async def health():
    """Health check endpoint."""
    return {"status": "ok"}



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
