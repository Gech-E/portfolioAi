"""
LLM Service — handles all AI generation through OpenAI/LangChain
"""

import uuid
from typing import Optional
from app.core.config import settings

# Prompt templates mapping
PROMPT_MAP = {
    "PORTFOLIO_BIO": {
        "system": "You are a professional branding expert. Generate a compelling, concise professional bio. Write in first person.",
        "user_template": "Write a professional bio for {name}, who is a {role}. Skills: {skills}.",
        "model": "gpt-4o-mini",
        "max_tokens": 500,
        "temperature": 0.7,
    },
    "RESUME_OPTIMIZE": {
        "system": "You are an expert resume writer and ATS optimization specialist.",
        "user_template": "Optimize this resume for: {target_role}. Job description: {job_description}. Resume: {resume_content}.",
        "model": "gpt-4o",
        "max_tokens": 3000,
        "temperature": 0.4,
    },
    "CASE_STUDY": {
        "system": "You are a technical writer who creates compelling project case studies.",
        "user_template": "Write a case study for project: {project_name}. Tech: {technologies}. Description: {description}.",
        "model": "gpt-4o",
        "max_tokens": 2000,
        "temperature": 0.7,
    },
    "SKILL_ANALYSIS": {
        "system": "You are a career intelligence AI. Analyze skills and provide actionable career guidance.",
        "user_template": "Analyze skills: {skills}. Current role: {current_role}. Target: {target_role}.",
        "model": "gpt-4o",
        "max_tokens": 3000,
        "temperature": 0.3,
    },
}


class LLMService:
    """Service for AI generation using OpenAI API"""

    def __init__(self):
        self.api_key = settings.openai_api_key

    async def generate(
        self,
        generation_type: str,
        input_data: dict,
        model: Optional[str] = None,
    ) -> dict:
        """Generate content using AI"""
        prompt_config = PROMPT_MAP.get(generation_type)
        if not prompt_config:
            raise ValueError(f"Unknown generation type: {generation_type}")

        used_model = model or prompt_config["model"]
        job_id = str(uuid.uuid4())

        # If no API key, return mock response
        if not self.api_key:
            return {
                "job_id": job_id,
                "status": "completed",
                "result": {
                    "content": f"[Mock AI Response] Generated {generation_type} content. Configure OPENAI_API_KEY for real generation.",
                    "type": generation_type,
                    "mock": True,
                },
                "tokens_used": 0,
                "model": used_model,
            }

        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=self.api_key)

            # Build user prompt from template
            user_prompt = prompt_config["user_template"]
            for key, value in input_data.items():
                user_prompt = user_prompt.replace(f"{{{key}}}", str(value))

            response = await client.chat.completions.create(
                model=used_model,
                messages=[
                    {"role": "system", "content": prompt_config["system"]},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=prompt_config["max_tokens"],
                temperature=prompt_config["temperature"],
            )

            content = response.choices[0].message.content
            tokens = response.usage.total_tokens if response.usage else 0

            return {
                "job_id": job_id,
                "status": "completed",
                "result": {"content": content, "type": generation_type},
                "tokens_used": tokens,
                "model": used_model,
            }

        except Exception as e:
            return {
                "job_id": job_id,
                "status": "failed",
                "result": {"error": str(e)},
                "tokens_used": 0,
                "model": used_model,
            }
