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

class CaseStudyOutput(BaseModel):
    title: str = Field(description="Compelling case study title")
    problem: str = Field(description="The problem or challenge addressed")
    solution: str = Field(description="The approach and solution implemented")
    outcome: str = Field(description="Measurable results and outcomes")
    impact: str = Field(description="Broader impact and lessons learned")
    technologies: List[str] = Field(description="Technologies used")

class ReadmeOutput(BaseModel):
    title: str = Field(description="Project title")
    description: str = Field(description="Project description paragraph")
    features: List[str] = Field(description="Key features list")
    installation: str = Field(description="Installation instructions")
    usage: str = Field(description="Usage examples")
    tech_stack: List[str] = Field(description="Technologies used")

class LinkedInSummaryOutput(BaseModel):
    headline: str = Field(description="Optimized LinkedIn headline (max 120 chars)")
    summary: str = Field(description="Recruiter-optimized LinkedIn About section (300-500 words)")
    skills: List[str] = Field(description="Top 10 skills to feature")

class ProjectDescriptionOutput(BaseModel):
    title: str = Field(description="Project title")
    short_description: str = Field(description="One-line project description")
    detailed_description: str = Field(description="Detailed project description (2-3 paragraphs)")
    highlights: List[str] = Field(description="Key highlights and achievements")
    technologies: List[str] = Field(description="Technologies used")

class ATSScoreOutput(BaseModel):
    score: int = Field(description="Overall ATS compatibility score from 0-100")
    breakdown: Dict[str, Any] = Field(description="Score breakdown by category: keywords, formatting, impact, relevance")
    suggestions: List[str] = Field(description="Actionable improvement suggestions")
    missing_keywords: List[str] = Field(description="Important keywords missing from the resume")

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
        "output_model": ExperienceOutput,
    },
    "CASE_STUDY": {
        "system": "You are a professional portfolio writer. Generate a compelling case study following the Problem-Solution-Outcome-Impact structure. Make it data-driven and results-focused.",
        "user_template": "Project Name: {projectName}. Description: {description}. Technologies: {technologies}. Role: {role}. Context: {context}.",
        "model": settings.openai_model_primary,
        "output_model": CaseStudyOutput,
    },
    "README": {
        "system": "You are a technical documentation expert. Generate a professional, comprehensive GitHub README.md for the given project. Include badges placeholders, clear structure, and developer-friendly formatting.",
        "user_template": "Repository: {repoName}. Description: {description}. Tech Stack: {techStack}. Features: {features}.",
        "model": settings.openai_model_fast,
        "output_model": ReadmeOutput,
    },
    "LINKEDIN_SUMMARY": {
        "system": "You are a LinkedIn optimization specialist. Create a recruiter-optimized LinkedIn profile. The headline should be keyword-rich. The summary should tell a compelling career story with strategic keyword placement.",
        "user_template": "Current summary: {currentSummary}. Role: {role}. Goals: {goals}. Key skills: {skills}.",
        "model": settings.openai_model_primary,
        "output_model": LinkedInSummaryOutput,
    },
    "PROJECT_DESCRIPTION": {
        "system": "You are a technical writer. Generate a compelling project description that highlights the technical challenges, solutions, and impact. Write for a portfolio audience of recruiters and hiring managers.",
        "user_template": "Project: {projectName}. Tech Stack: {techStack}. Description: {description}. GitHub URL: {githubUrl}.",
        "model": settings.openai_model_fast,
        "output_model": ProjectDescriptionOutput,
    },
    "ATS_SCORE": {
        "system": "You are an ATS (Applicant Tracking System) expert. Analyze the resume content against the target role and job description. Provide a detailed ATS compatibility score with breakdown and actionable suggestions. Be specific about missing keywords and formatting issues.",
        "user_template": "Resume Content: {resume}. Target Role: {targetRole}. Job Description: {jobDescription}.",
        "model": settings.openai_model_primary,
        "output_model": ATSScoreOutput,
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
                    "tokens_used": 0,
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
                "tokens_used": 0,
            }

        except Exception as e:
            return {
                "job_id": job_id,
                "status": "failed",
                "result": {"error": str(e)},
                "model": used_model,
                "tokens_used": 0,
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
                "tokens_used": 0,
            }
        except Exception as e:
            return {"job_id": job_id, "status": "failed", "result": {"error": str(e)}, "tokens_used": 0}

    def _mock_response(self, job_id: str, type: str, model: str):
        """Return realistic mock responses for each generation type"""
        mock_results = {
            "PORTFOLIO_BIO": {
                "headline": "Full-Stack Developer & AI Enthusiast | Building the Future of Web",
                "summary": "Innovative developer passionate about creating elegant solutions to complex problems.",
                "detailed_bio": "I'm a Full-Stack Developer with over 5 years of experience building scalable web applications. My expertise spans React, Node.js, Python, and cloud infrastructure. I'm passionate about leveraging AI to create tools that empower developers and professionals. When I'm not coding, you'll find me contributing to open-source projects and mentoring aspiring developers.",
            },
            "CASE_STUDY": {
                "title": "Transforming User Experience with AI-Powered Portfolio Generation",
                "problem": "Professionals spend 10-40+ hours creating portfolios, leading to missed opportunities and poor self-presentation.",
                "solution": "Built an AI-powered platform that automatically generates professional portfolios from existing data sources like GitHub and LinkedIn.",
                "outcome": "Reduced portfolio creation time from 40 hours to under 5 minutes with a 95% user satisfaction rate.",
                "impact": "Democratized professional branding for 10,000+ users, with 80% reporting increased interview callbacks.",
                "technologies": ["React", "Next.js", "Python", "OpenAI GPT-4", "PostgreSQL"],
            },
            "README": {
                "title": "Project Name",
                "description": "A modern, scalable application built with cutting-edge technologies.",
                "features": ["Feature 1: Core functionality", "Feature 2: AI integration", "Feature 3: Real-time updates"],
                "installation": "npm install\nnpm run dev",
                "usage": "Visit http://localhost:3000 to get started.",
                "tech_stack": ["TypeScript", "React", "Node.js"],
            },
            "LINKEDIN_SUMMARY": {
                "headline": "Full-Stack Developer | React & Node.js | Building AI-Powered Solutions",
                "summary": "Results-driven Full-Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and AI integration. Passionate about creating elegant solutions that make a real impact. Currently exploring the intersection of AI and developer tools.",
                "skills": ["React", "Node.js", "TypeScript", "Python", "AWS", "PostgreSQL", "AI/ML", "System Design", "Leadership", "Agile"],
            },
            "PROJECT_DESCRIPTION": {
                "title": "AI-Powered Portfolio Builder",
                "short_description": "An intelligent platform that auto-generates professional portfolios from your existing data.",
                "detailed_description": "This project tackles the challenge of professional self-presentation by leveraging AI to transform raw user data into compelling portfolio websites. Built with a modern tech stack, it integrates with major platforms and uses LLMs to generate recruiter-optimized content.",
                "highlights": ["5-minute portfolio generation", "ATS-optimized resume builder", "GitHub + LinkedIn integration"],
                "technologies": ["Next.js", "NestJS", "FastAPI", "OpenAI", "PostgreSQL"],
            },
            "ATS_SCORE": {
                "score": 72,
                "breakdown": {
                    "keywords": {"score": 68, "feedback": "Add more industry-specific keywords"},
                    "formatting": {"score": 85, "feedback": "Good structure and formatting"},
                    "impact": {"score": 65, "feedback": "Use more quantified achievements"},
                    "relevance": {"score": 70, "feedback": "Align experience with target role"},
                },
                "suggestions": [
                    "Add quantified achievements (e.g., 'Increased revenue by 25%')",
                    "Include more keywords from the job description",
                    "Add a professional summary section",
                    "Use action verbs to start bullet points",
                ],
                "missing_keywords": ["microservices", "CI/CD", "agile", "system design"],
            },
            "CAREER_ROADMAP": {
                "milestones": [
                    {"title": "Foundation Skills", "description": "Master core competencies required for the target role", "resources": ["Online courses", "Documentation"], "duration": "2 months"},
                    {"title": "Project Experience", "description": "Build portfolio projects demonstrating target skills", "resources": ["GitHub", "Personal projects"], "duration": "2 months"},
                    {"title": "Interview Preparation", "description": "Practice system design and coding interviews", "resources": ["LeetCode", "Mock interviews"], "duration": "1 month"},
                ],
                "summary": "A focused roadmap to transition to your target role within the specified timeline.",
            },
            "SKILL_ANALYSIS": {
                "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
                "employabilityScore": 74,
                "gaps": ["System Design", "Cloud Architecture", "DevOps"],
                "recommendations": ["Take a system design course", "Get AWS certified", "Practice with Kubernetes"],
            },
        }

        result = mock_results.get(type, {"content": f"[Mock] Generated {type} content.", "mock": True})

        return {
            "job_id": job_id,
            "status": "completed",
            "result": result,
            "model": model,
            "tokens_used": 0,
        }
