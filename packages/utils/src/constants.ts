/**
 * Application-wide constants
 */

// ---- Plan Limits ----
export const PLAN_LIMITS = {
  FREE: {
    maxPortfolios: 1,
    maxResumes: 2,
    aiCreditsPerMonth: 10,
    customDomain: false,
    analyticsAccess: false,
    prioritySupport: false,
    maxFileUploadMB: 5,
  },
  PRO: {
    maxPortfolios: 5,
    maxResumes: 10,
    aiCreditsPerMonth: 50,
    customDomain: true,
    analyticsAccess: true,
    prioritySupport: false,
    maxFileUploadMB: 25,
  },
  PRO_PLUS: {
    maxPortfolios: -1, // unlimited
    maxResumes: -1,
    aiCreditsPerMonth: 200,
    customDomain: true,
    analyticsAccess: true,
    prioritySupport: true,
    maxFileUploadMB: 100,
  },
} as const;

// ---- AI Costs (credits) ----
export const AI_CREDIT_COSTS = {
  PORTFOLIO_BIO: 1,
  PORTFOLIO_ABOUT: 1,
  PORTFOLIO_FULL: 5,
  RESUME_OPTIMIZE: 3,
  RESUME_REWRITE: 2,
  CASE_STUDY: 3,
  README: 1,
  SKILL_ANALYSIS: 2,
  CAREER_ROADMAP: 4,
  LINKEDIN_SUMMARY: 1,
  PROJECT_DESCRIPTION: 1,
} as const;

// ---- Pagination ----
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ---- Auth ----
export const PASSWORD_MIN_LENGTH = 8;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;

// ---- File Upload ----
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

// ---- Portfolio ----
export const MAX_PORTFOLIO_SECTIONS = 20;
export const PORTFOLIO_SLUG_MAX_LENGTH = 60;

// ---- Routes ----
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  portfolio: '/portfolio',
  portfolioEditor: (id: string) => `/portfolio/${id}/edit`,
  resume: '/resume',
  resumeEditor: (id: string) => `/resume/${id}/edit`,
  aiTools: '/ai-tools',
  analytics: '/analytics',
  careerRoadmap: '/career-roadmap',
  integrations: '/integrations',
  settings: '/settings',
  billing: '/settings/billing',
  pricing: '/pricing',
  publicPortfolio: (slug: string) => `/p/${slug}`,
} as const;
