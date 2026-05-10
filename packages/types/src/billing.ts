// ---- Billing Types ----
export const PlanTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  PRO_PLUS: 'PRO_PLUS',
} as const;

export type PlanTier = (typeof PlanTier)[keyof typeof PlanTier];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  TRIALING: 'TRIALING',
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: PlanFeature[];
  aiCreditsPerMonth: number;
  maxPortfolios: number;
  maxResumes: number;
  customDomain: boolean;
  analyticsAccess: boolean;
  prioritySupport: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
  createdAt: string;
}
