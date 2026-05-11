'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './Dashboard.module.css';

import { StatsGrid } from './components/StatsGrid/StatsGrid';
import { PortfolioList } from './components/PortfolioList/PortfolioList';
import { AIToolsList } from './components/AIToolsList/AIToolsList';

interface OverviewData {
  stats: {
    totalViews: number;
    totalDownloads: number;
    portfolioCount: number;
    resumeCount: number;
    aiGenerations: number;
    recentViews: number;
    uniqueVisitors: number;
    engagementRate: string;
  };
  viewsChart: { date: string; views: number }[];
  referrers: { source: string; count: number }[];
}

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  templateId: string | null;
}

interface Credits {
  total: number;
  used: number;
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [overviewRes, portfoliosRes, creditsRes] = await Promise.allSettled([
        api.get<OverviewData>('/analytics/overview'),
        api.get<Portfolio[]>('/portfolios'),
        api.get<Credits>('/ai/credits'),
      ]);

      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data as any);
      if (portfoliosRes.status === 'fulfilled') setPortfolios((portfoliosRes.value.data as any) || []);
      if (creditsRes.status === 'fulfilled') setCredits(creditsRes.value.data as any);
    } catch {
      // Silently handle — dashboard still renders with fallbacks
    } finally {
      setLoading(false);
    }
  };

  const stats = overview?.stats;
  const creditsRemaining = credits ? credits.total - credits.used : 0;
  const creditsTotal = credits?.total || 0;

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StatsGrid stats={stats} creditsRemaining={creditsRemaining} creditsTotal={creditsTotal} />

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <PortfolioList portfolios={portfolios} />
        </div>

        <div className={styles.rightColumn}>
          <AIToolsList />
        </div>
      </div>
    </div>
  );
}
