import { z } from 'zod';

// ---- Enums ----
export const PortfolioStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type PortfolioStatus = (typeof PortfolioStatus)[keyof typeof PortfolioStatus];

export const PortfolioSectionType = {
  HERO: 'HERO',
  ABOUT: 'ABOUT',
  EXPERIENCE: 'EXPERIENCE',
  PROJECTS: 'PROJECTS',
  SKILLS: 'SKILLS',
  EDUCATION: 'EDUCATION',
  TESTIMONIALS: 'TESTIMONIALS',
  CONTACT: 'CONTACT',
  CASE_STUDY: 'CASE_STUDY',
  CUSTOM: 'CUSTOM',
} as const;

export type PortfolioSectionType =
  (typeof PortfolioSectionType)[keyof typeof PortfolioSectionType];

// ---- Schemas ----
export const createPortfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(300).optional(),
  templateId: z.string().optional(),
  theme: z
    .object({
      primaryColor: z.string().default('#2563EB'),
      fontFamily: z.string().default('Inter'),
      mode: z.enum(['light', 'dark']).default('light'),
    })
    .optional(),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;

export const updatePortfolioSchema = createPortfolioSchema.partial();
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;

// ---- Types ----
export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description?: string;
  status: PortfolioStatus;
  templateId?: string;
  theme: PortfolioTheme;
  sections: PortfolioSection[];
  seoMeta?: SEOMeta;
  customDomain?: string;
  publishedUrl?: string;
  viewCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PortfolioTheme {
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  mode: 'light' | 'dark';
  customCSS?: string;
}

export interface PortfolioSection {
  id: string;
  type: PortfolioSectionType;
  title: string;
  content: Record<string, unknown>;
  order: number;
  visible: boolean;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  thumbnailUrl: string;
  category: string;
  sections: PortfolioSectionType[];
  theme: PortfolioTheme;
  isPremium: boolean;
}

export interface PortfolioListItem {
  id: string;
  title: string;
  slug: string;
  status: PortfolioStatus;
  publishedUrl?: string;
  viewCount: number;
  updatedAt: string;
  template?: string;
  thumbnailUrl?: string;
}
