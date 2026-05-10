from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
        "version": "1.0.0",
    }


@router.get("/health/ready")
async def readiness():
    return {"status": "ready"}


@router.get("/health/live")
async def liveness():
    return {"status": "alive"}
