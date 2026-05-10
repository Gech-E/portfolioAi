import { z } from 'zod';

// ---- Enums ----
export const UserRole = {
  FREE: 'FREE',
  PRO: 'PRO',
  PRO_PLUS: 'PRO_PLUS',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ---- Zod Schemas ----
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  headline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  socialLinks: z
    .object({
      github: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      dribbble: z.string().url().optional().or(z.literal('')),
      behance: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// ---- User Types ----
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  mfaEnabled: boolean;
  socialLinks?: Record<string, string>;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
}
