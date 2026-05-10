// ---- AI Generation Types ----
export const AIGenerationType = {
  PORTFOLIO_BIO: 'PORTFOLIO_BIO',
  PORTFOLIO_ABOUT: 'PORTFOLIO_ABOUT',
  PORTFOLIO_FULL: 'PORTFOLIO_FULL',
  RESUME_OPTIMIZE: 'RESUME_OPTIMIZE',
  RESUME_REWRITE: 'RESUME_REWRITE',
  CASE_STUDY: 'CASE_STUDY',
  README: 'README',
  SKILL_ANALYSIS: 'SKILL_ANALYSIS',
  CAREER_ROADMAP: 'CAREER_ROADMAP',
  LINKEDIN_SUMMARY: 'LINKEDIN_SUMMARY',
  PROJECT_DESCRIPTION: 'PROJECT_DESCRIPTION',
} as const;

export type AIGenerationType = (typeof AIGenerationType)[keyof typeof AIGenerationType];

export const AIJobStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type AIJobStatus = (typeof AIJobStatus)[keyof typeof AIJobStatus];

export interface AIGeneration {
  id: string;
  userId: string;
  type: AIGenerationType;
  status: AIJobStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  model: string;
  tokensUsed: number;
  creditsUsed: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface AICredit {
  total: number;
  used: number;
  remaining: number;
  resetsAt: string;
  plan: string;
}

export interface AIGenerationRequest {
  type: AIGenerationType;
  input: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high';
}

export interface AIGenerationResponse {
  jobId: string;
  status: AIJobStatus;
  estimatedTime?: number;
}

// ---- Skill Types ----
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  source: 'github' | 'linkedin' | 'resume' | 'manual' | 'ai';
  endorsements?: number;
  projects?: number;
}

export interface SkillGapAnalysis {
  currentSkills: Skill[];
  targetRole: string;
  requiredSkills: Skill[];
  gaps: SkillGap[];
  employabilityScore: number;
  recommendations: SkillRecommendation[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SkillRecommendation {
  type: 'course' | 'certification' | 'project' | 'practice';
  title: string;
  description: string;
  url?: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  currentRole: string;
  targetRole: string;
  timelineMonths: number;
  milestones: RoadmapMilestone[];
  createdAt: string;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  skills: string[];
  month: number;
  completed: boolean;
  resources: string[];
}
