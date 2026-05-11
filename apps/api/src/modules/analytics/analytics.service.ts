import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [
      totalViews,
      totalDownloads,
      portfolioCount,
      resumeCount,
      aiGenerations,
      recentViews,
    ] = await Promise.all([
      this.prisma.portfolioView.count({
        where: { portfolio: { userId } },
      }),
      this.prisma.resumeDownload.count({
        where: { userId },
      }),
      this.prisma.portfolio.count({
        where: { userId },
      }),
      this.prisma.resume.count({
        where: { userId },
      }),
      this.prisma.aIGeneration.count({
        where: { userId },
      }),
      // Views in last 30 days
      this.prisma.portfolioView.count({
        where: {
          portfolio: { userId },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Views per day for chart (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const viewsRaw = await this.prisma.portfolioView.findMany({
      where: {
        portfolio: { userId },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const viewsByDay: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      viewsByDay[key] = 0;
    }
    for (const view of viewsRaw) {
      const key = view.createdAt.toISOString().split('T')[0];
      if (viewsByDay[key] !== undefined) {
        viewsByDay[key]++;
      }
    }

    const viewsChart = Object.entries(viewsByDay).map(([date, count]) => ({
      date,
      views: count,
    }));

    // Referrer breakdown
    const referrers = await this.prisma.portfolioView.groupBy({
      by: ['referrer'],
      where: {
        portfolio: { userId },
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    });

    return {
      stats: {
        totalViews,
        totalDownloads,
        portfolioCount,
        resumeCount,
        aiGenerations,
        recentViews,
        uniqueVisitors: Math.round(totalViews * 0.65), // Approximation
        engagementRate: totalViews > 0 ? ((totalDownloads / totalViews) * 100).toFixed(1) : '0',
      },
      viewsChart,
      referrers: referrers.map((r) => ({
        source: r.referrer || 'Direct',
        count: r._count,
      })),
    };
  }

  async trackView(portfolioId: string, data: {
    visitorId?: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
  }) {
    await this.prisma.portfolioView.create({
      data: {
        portfolioId,
        visitorId: data.visitorId,
        referrer: data.referrer,
        userAgent: data.userAgent,
        country: data.country,
      },
    });

    await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: { viewCount: { increment: 1 } },
    });

    return { tracked: true };
  }

  async getPortfolioAnalytics(portfolioId: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
    });

    if (!portfolio) return null;

    const totalViews = await this.prisma.portfolioView.count({
      where: { portfolioId },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentViews = await this.prisma.portfolioView.count({
      where: { portfolioId, createdAt: { gte: thirtyDaysAgo } },
    });

    const viewsRaw = await this.prisma.portfolioView.findMany({
      where: { portfolioId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const viewsByDay: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      viewsByDay[date.toISOString().split('T')[0]] = 0;
    }
    for (const view of viewsRaw) {
      const key = view.createdAt.toISOString().split('T')[0];
      if (viewsByDay[key] !== undefined) viewsByDay[key]++;
    }

    return {
      portfolioId,
      title: portfolio.title,
      totalViews,
      recentViews,
      viewsChart: Object.entries(viewsByDay).map(([date, views]) => ({ date, views })),
    };
  }
}
