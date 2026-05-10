"""
AI Generation routes — handles portfolio bio, resume optimization, case studies, etc.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()


class GenerationRequest(BaseModel):
    type: str
    input: dict
    model: Optional[str] = None
    priority: Optional[str] = "normal"


class GenerationResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[dict] = None
    tokens_used: int = 0
    model: str = ""


@router.post("/generate", response_model=GenerationResponse)
async def generate(request: GenerationRequest):
    """Submit an AI generation job"""
    try:
        result = await llm_service.generate(
            generation_type=request.type,
            input_data=request.input,
            model=request.model,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.get("/generate/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a generation job"""
    return {
        "job_id": job_id,
        "status": "completed",
        "message": "Job status tracking will be implemented with Redis/BullMQ",
    }


@router.get("/credits/{user_id}")
async def get_credits(user_id: str):
    """Get AI credits for a user"""
    return {
        "user_id": user_id,
        "total": 50,
        "used": 12,
        "remaining": 38,
        "resets_at": "2026-06-01T00:00:00Z",
    }
