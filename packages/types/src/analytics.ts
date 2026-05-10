// ---- Analytics Types ----
export interface AnalyticsDashboard {
  portfolioViews: MetricSummary;
  resumeDownloads: MetricSummary;
  aiCredits: AICredit;
  employabilityScore: MetricSummary;
  recentActivity: ActivityItem[];
  topPortfolios: PortfolioMetric[];
  viewsBySource: SourceMetric[];
  viewsOverTime: TimeSeriesPoint[];
}

export interface MetricSummary {
  value: number;
  change: number;
  changePercent: number;
  period: string;
  trend: 'up' | 'down' | 'flat';
}

export interface ActivityItem {
  id: string;
  type: 'ai_generation' | 'portfolio_publish' | 'resume_download' | 'integration_sync' | 'portfolio_view';
  title: string;
  description?: string;
  icon: string;
  color: string;
  timestamp: string;
}

export interface PortfolioMetric {
  portfolioId: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
}

export interface SourceMetric {
  source: string;
  views: number;
  percentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

// Import from ai.ts
import type { AICredit } from './ai';
export type { AICredit as AnalyticsAICredit };
