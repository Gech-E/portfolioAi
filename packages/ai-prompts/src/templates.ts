import type { PromptConfig } from './registry';

export const PROMPT_TEMPLATES: PromptConfig[] = [
  {
    name: 'portfolio_bio',
    type: 'PORTFOLIO_BIO',
    version: 1,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: `You are a professional branding expert who writes compelling, concise professional bios. Write in first person. Be authentic, confident, and specific. Avoid clichés and buzzwords. Focus on unique value proposition and measurable achievements.`,
    userPromptTemplate: `Write a professional bio for {{name}}, who is a {{role}}.

Key skills: {{skills}}
Experience highlights: {{experience}}
Tone: {{tone}}

Write 2-3 paragraphs that would work as an "About Me" section on a portfolio website. Include specific achievements where possible.`,
  },
  {
    name: 'portfolio_about',
    type: 'PORTFOLIO_ABOUT',
    version: 1,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 800,
    systemPrompt: `You are a portfolio content specialist. Create engaging, professional "About" sections that tell a compelling career story. Use a conversational yet professional tone.`,
    userPromptTemplate: `Create an About section for {{name}}'s portfolio.

Role: {{role}}
Years of experience: {{yearsExperience}}
Skills: {{skills}}
Career highlights: {{highlights}}
Personal interests: {{interests}}

Structure: Opening hook → Career journey → Current focus → What drives them.`,
  },
  {
    name: 'resume_optimize',
    type: 'RESUME_OPTIMIZE',
    version: 1,
    model: 'gpt-4o',
    temperature: 0.4,
    maxTokens: 4000,
    systemPrompt: `You are an expert resume writer and ATS optimization specialist. Your goal is to maximize the resume's ATS score while maintaining authenticity. Focus on:
1. Keyword optimization from the job description
2. Strong action verbs (Led, Developed, Implemented, Architected)
3. Quantified achievements (percentages, dollar amounts, team sizes)
4. Clean formatting for ATS parsers
5. Relevant skills prominence

Return the optimized resume sections as structured JSON.`,
    userPromptTemplate: `Optimize this resume for the target role.

Target Role: {{targetRole}}
Target Company: {{targetCompany}}
Job Description: {{jobDescription}}

Current Resume:
{{resumeContent}}

Return a JSON object with optimized sections: summary, experience (array), skills (array), and suggestions (array of improvements made).`,
  },
  {
    name: 'case_study',
    type: 'CASE_STUDY',
    version: 1,
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 3000,
    systemPrompt: `You are a technical writer who creates compelling project case studies for developer portfolios. Structure case studies with: Challenge → Approach → Solution → Results. Use specific technical details.`,
    userPromptTemplate: `Write a case study for the following project:

Project: {{projectName}}
Description: {{description}}
Technologies: {{technologies}}
My Role: {{role}}
Duration: {{duration}}
Team Size: {{teamSize}}

Additional context: {{context}}

Structure the case study with: Overview, Challenge, Approach, Technical Implementation, Results & Impact, Key Learnings.`,
  },
  {
    name: 'readme_generate',
    type: 'README',
    version: 1,
    model: 'gpt-4o-mini',
    temperature: 0.5,
    maxTokens: 2000,
    systemPrompt: `You are a developer documentation expert. Generate professional, comprehensive README.md files following best practices. Include badges, clear installation instructions, and usage examples.`,
    userPromptTemplate: `Generate a README.md for this GitHub repository:

Repository: {{repoName}}
Description: {{description}}
Language: {{language}}
Technologies: {{technologies}}
Features: {{features}}

Include: Project title with badges, description, features list, tech stack, installation, usage, API reference (if applicable), contributing guidelines, and license.`,
  },
  {
    name: 'skill_analysis',
    type: 'SKILL_ANALYSIS',
    version: 1,
    model: 'gpt-4o',
    temperature: 0.3,
    maxTokens: 3000,
    systemPrompt: `You are a career intelligence AI that analyzes professional skills and provides actionable career guidance. Be data-driven and specific in your recommendations.`,
    userPromptTemplate: `Analyze the skill profile and provide career recommendations.

Current Skills: {{skills}}
Current Role: {{currentRole}}
Target Role: {{targetRole}}
Experience Level: {{experienceLevel}}
GitHub Data: {{githubData}}

Provide:
1. Skill gap analysis (current vs required for target role)
2. Employability score (0-100) with breakdown
3. Top 5 recommended skills to learn
4. Suggested certifications
5. Project ideas to build missing skills
6. Estimated timeline to reach target role

Return as structured JSON.`,
  },
  {
    name: 'linkedin_summary',
    type: 'LINKEDIN_SUMMARY',
    version: 1,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 600,
    systemPrompt: `You are a LinkedIn optimization expert. Write summaries that are recruiter-optimized, keyword-rich, and compelling. Use first person, be specific about achievements, and include a clear call-to-action.`,
    userPromptTemplate: `Write a LinkedIn summary for {{name}}.

Current role: {{role}}
Industry: {{industry}}
Key skills: {{skills}}
Achievements: {{achievements}}
Looking for: {{goals}}

Write a 3-4 paragraph LinkedIn summary that will attract recruiters for {{targetRole}} positions.`,
  },
  {
    name: 'project_description',
    type: 'PROJECT_DESCRIPTION',
    version: 1,
    model: 'gpt-4o-mini',
    temperature: 0.6,
    maxTokens: 500,
    systemPrompt: `You are a technical portfolio writer. Write concise, impactful project descriptions that highlight technical complexity and business impact.`,
    userPromptTemplate: `Write a portfolio project description for:

Project: {{projectName}}
Tech Stack: {{techStack}}
Description: {{rawDescription}}
My Contribution: {{contribution}}

Write 2-3 sentences that highlight the technical challenge, solution, and impact. Be specific and quantify results where possible.`,
  },
];
