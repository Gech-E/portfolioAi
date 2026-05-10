import { z } from 'zod';

// ---- Enums ----
export const ResumeStatus = {
  DRAFT: 'DRAFT',
  READY: 'READY',
  OPTIMIZING: 'OPTIMIZING',
} as const;

export type ResumeStatus = (typeof ResumeStatus)[keyof typeof ResumeStatus];

// ---- Schemas ----
export const createResumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  targetRole: z.string().max(100).optional(),
  targetCompany: z.string().max(100).optional(),
  jobDescription: z.string().max(5000).optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;

// ---- Types ----
export interface Resume {
  id: string;
  userId: string;
  title: string;
  status: ResumeStatus;
  targetRole?: string;
  targetCompany?: string;
  sections: ResumeSection[];
  atsScore?: ATSScore;
  version: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  title: string;
  content: Record<string, unknown>;
  order: number;
  visible: boolean;
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  sectionCompleteness: number;
  actionVerbs: number;
  quantification: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: ATSSuggestion[];
  analyzedAt: string;
}

export interface ATSSuggestion {
  type: 'keyword' | 'formatting' | 'content' | 'action_verb';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  section?: string;
  suggestion: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  bullets: string[];
  technologies?: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}
