"""
LLM Service — handles all AI generation through OpenAI/LangChain
"""

import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.core.config import settings

# Structured output models
class BioOutput(BaseModel):
    headline: str = Field(description="A catchy professional headline")
    summary: str = Field(description="A short professional summary (1-2 sentences)")
    detailed_bio: str = Field(description="A longer, multi-paragraph professional bio")

class ExperienceOutput(BaseModel):
    achievements: List[str] = Field(description="List of 3-5 high-impact bullet points")
    keywords: List[str] = Field(description="Relevant keywords for ATS optimization")

class RoadmapMilestone(BaseModel):
    title: str = Field(description="Milestone title")
    description: str = Field(description="Milestone description")
    resources: List[str] = Field(description="Recommended resources (links or names)")
    duration: str = Field(description="Estimated time to complete")

class RoadmapOutput(BaseModel):
    milestones: List[RoadmapMilestone] = Field(description="List of milestones to reach target role")
    summary: str = Field(description="Brief overview of the roadmap")

class SkillAnalysisOutput(BaseModel):
    skills: List[str] = Field(description="Detected user skills")
    employabilityScore: int = Field(description="Score from 0-100")
    gaps: List[str] = Field(description="Identified skill gaps for target role")
    recommendations: List[str] = Field(description="Actionable recommendations")

# Prompt templates mapping
PROMPT_MAP = {
    "PORTFOLIO_BIO": {
        "system": "You are a professional branding expert. Generate a compelling professional bio and headline. Write in first person.",
        "user_template": "Write a professional bio for {name}, who is a {role}. Skills: {skills}. Background: {background}.",
        "model": settings.openai_model_fast,
        "output_model": BioOutput,
    },
    "EXPERIENCE_OPTIMIZE": {
        "system": "You are an expert resume writer. Generate high-impact bullet points and keywords for this experience.",
        "user_template": "Company: {company}. Role: {role}. Description: {description}. Tech: {technologies}.",
        "model": settings.openai_model_primary,
        "output_model": ExperienceOutput,
    },
    "RESUME_OPTIMIZE": {
        "system": "You are an ATS expert. Optimize the user's resume content for the provided job description. Focus on keyword density and achievement-based bullet points.",
        "user_template": "Resume Content: {resume}. Job Description: {jobDescription}.",
        "model": settings.openai_model_primary,
        "output_model": ExperienceOutput, # Reuse for now or define ResumeOutput
    },
    "CAREER_ROADMAP": {
        "system": "You are a career coach. Generate a step-by-step roadmap to help the user transition from their current role to their target role.",
        "user_template": "Current Role: {currentRole}. Target Role: {targetRole}. Timeline: {timelineMonths} months.",
        "model": settings.openai_model_primary,
        "output_model": RoadmapOutput,
    },
    "SKILL_ANALYSIS": {
        "system": "You are a talent analyzer. Assess the user's skills against their target role and identify gaps.",
        "user_template": "Target Role: {targetRole}. Context: {context}.",
        "model": settings.openai_model_primary,
        "output_model": SkillAnalysisOutput,
    },
}


class LLMService:
    """Service for AI generation using LangChain and OpenAI"""

    def __init__(self):
        self.api_key = settings.openai_api_key

    def _get_llm(self, model: str, temperature: float = 0.7):
        return ChatOpenAI(
            api_key=self.api_key,
            model=model,
            temperature=temperature,
        )

    async def generate(
        self,
        generation_type: str,
        input_data: dict,
        model: Optional[str] = None,
    ) -> dict:
        """Generate content using AI with LangChain"""
        prompt_config = PROMPT_MAP.get(generation_type)
        
        # Fallback for simple generation if type not in PROMPT_MAP
        if not prompt_config:
            return await self._simple_generate(generation_type, input_data, model)

        used_model = model or prompt_config["model"]
        job_id = str(uuid.uuid4())

        # If no API key, return mock response
        if not self.api_key:
            return self._mock_response(job_id, generation_type, used_model)

        try:
            llm = self._get_llm(used_model)
            
            # Use structured output if model is provided
            output_model = prompt_config.get("output_model")
            if output_model:
                structured_llm = llm.with_structured_output(output_model)
                
                prompt = ChatPromptTemplate.from_messages([
                    ("system", prompt_config["system"]),
                    ("user", prompt_config["user_template"]),
                ])
                
                chain = prompt | structured_llm
                result = await chain.ainvoke(input_data)
                
                return {
                    "job_id": job_id,
                    "status": "completed",
                    "result": result.model_dump(),
                    "model": used_model,
                }
            
            # Standard generation
            prompt = ChatPromptTemplate.from_messages([
                ("system", prompt_config["system"]),
                ("user", prompt_config["user_template"]),
            ])
            
            chain = prompt | llm
            response = await chain.ainvoke(input_data)
            
            return {
                "job_id": job_id,
                "status": "completed",
                "result": {"content": response.content},
                "model": used_model,
            }

        except Exception as e:
            return {
                "job_id": job_id,
                "status": "failed",
                "result": {"error": str(e)},
                "model": used_model,
            }

    async def _simple_generate(self, type: str, data: dict, model: Optional[str]):
        """Fallback for types not in PROMPT_MAP"""
        job_id = str(uuid.uuid4())
        used_model = model or settings.openai_model_fast
        
        if not self.api_key:
            return self._mock_response(job_id, type, used_model)
            
        try:
            llm = self._get_llm(used_model)
            response = await llm.ainvoke(str(data))
            return {
                "job_id": job_id,
                "status": "completed",
                "result": {"content": response.content},
                "model": used_model,
            }
        except Exception as e:
            return {"job_id": job_id, "status": "failed", "result": {"error": str(e)}}

    def _mock_response(self, job_id: str, type: str, model: str):
        return {
            "job_id": job_id,
            "status": "completed",
            "result": {
                "content": f"[Mock] Generated {type} content.",
                "mock": True,
            },
            "model": model,
        }

