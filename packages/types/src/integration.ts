// ---- Integration Types ----
export const IntegrationProvider = {
  GITHUB: 'GITHUB',
  LINKEDIN: 'LINKEDIN',
  BEHANCE: 'BEHANCE',
  DRIBBBLE: 'DRIBBBLE',
  MEDIUM: 'MEDIUM',
  GOOGLE_SCHOLAR: 'GOOGLE_SCHOLAR',
  KAGGLE: 'KAGGLE',
  STACK_OVERFLOW: 'STACK_OVERFLOW',
} as const;

export type IntegrationProvider = (typeof IntegrationProvider)[keyof typeof IntegrationProvider];

export const IntegrationStatus = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
  SYNCING: 'SYNCING',
} as const;

export type IntegrationStatus = (typeof IntegrationStatus)[keyof typeof IntegrationStatus];

export interface Integration {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  externalUsername?: string;
  profileUrl?: string;
  lastSyncAt?: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface GitHubProfile {
  username: string;
  avatarUrl: string;
  bio?: string;
  publicRepos: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguages: { name: string; percentage: number }[];
  repositories: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  description?: string;
  url: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  profileUrl: string;
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }[];
  skills: string[];
}
