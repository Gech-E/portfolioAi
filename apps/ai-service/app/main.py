"""
PortfolioAI — AI Service
FastAPI microservice for AI generation, analysis, and orchestration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, generation
from app.core.config import settings

app = FastAPI(
    title="PortfolioAI AI Service",
    description="AI generation and analysis microservice",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.app_url, "http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(generation.router, prefix="/api/ai", tags=["AI Generation"])


@app.get("/")
async def root():
    return {"service": "PortfolioAI AI Service", "status": "running", "version": "1.0.0"}
