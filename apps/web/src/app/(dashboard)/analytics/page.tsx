'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, TrendingUp, Users, Globe, BarChart3, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.get<OverviewData>('/analytics/overview');
      if (response.success) {
        setOverview(response.data as any);
      }
    } catch {
      // Use fallback data if API not available
      setOverview({
        stats: { totalViews: 0, totalDownloads: 0, portfolioCount: 0, resumeCount: 0, aiGenerations: 0, recentViews: 0, uniqueVisitors: 0, engagementRate: '0' },
        viewsChart: [],
        referrers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = overview?.stats;

  // Get chart data based on period
  const getChartData = () => {
    if (!overview?.viewsChart) return [];
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    return overview.viewsChart.slice(-days);
  };

  const chartData = getChartData();
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">Track your portfolio performance and engagement</p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Views', value: stats?.totalViews?.toLocaleString() || '0', icon: Eye, change: `${stats?.recentViews || 0} this month`, color: 'text-blue-600' },
          { label: 'Unique Visitors', value: stats?.uniqueVisitors?.toLocaleString() || '0', icon: Users, change: 'estimated', color: 'text-purple-600' },
          { label: 'Downloads', value: stats?.totalDownloads?.toLocaleString() || '0', icon: Download, change: 'resume exports', color: 'text-green-600' },
          { label: 'Engagement Rate', value: `${stats?.engagementRate || '0'}%`, icon: TrendingUp, change: 'views to download', color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</div>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        {/* Chart */}
        <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" /> Views over time
            </h3>
            <span className="text-xs text-gray-400">{chartData.length} days</span>
          </div>

          {chartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              <div className="text-center">
                <Eye className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p>No view data yet</p>
                <p className="text-xs mt-1">Views will appear once your portfolio is published</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-right">
                <span className="text-[10px] text-gray-400">{maxViews}</span>
                <span className="text-[10px] text-gray-400">{Math.round(maxViews / 2)}</span>
                <span className="text-[10px] text-gray-400">0</span>
              </div>

              {/* SVG Chart */}
              <div className="ml-10">
                <svg width="100%" height="200" viewBox={`0 0 ${chartData.length * 20} 200`} preserveAspectRatio="none" className="overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2={chartData.length * 20} y2="0" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="100" x2={chartData.length * 20} y2="100" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="200" x2={chartData.length * 20} y2="200" stroke="#f3f4f6" strokeWidth="1" />

                  {/* Gradient fill */}
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area */}
                  <path
                    d={`M0,200 ${chartData.map((d, i) => `L${i * 20 + 10},${200 - (d.views / maxViews) * 180}`).join(' ')} L${(chartData.length - 1) * 20 + 10},200 Z`}
                    fill="url(#viewsGradient)"
                  />

                  {/* Line */}
                  <path
                    d={chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${i * 20 + 10},${200 - (d.views / maxViews) * 180}`).join(' ')}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {chartData.map((d, i) => (
                    <circle
                      key={i}
                      cx={i * 20 + 10}
                      cy={200 - (d.views / maxViews) * 180}
                      r="3"
                      fill="white"
                      stroke="#2563eb"
                      strokeWidth="2"
                      className="hover:r-4 transition-all"
                    />
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2">
                  {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((d) => (
                    <span key={d.date} className="text-[10px] text-gray-400">
                      {new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-5">
              <Globe className="h-4 w-4 text-purple-600" /> Traffic sources
            </h3>
            {(!overview?.referrers || overview.referrers.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-4">No referrer data yet</p>
            ) : (
              <div className="space-y-3">
                {overview.referrers.map((ref, i) => {
                  const total = overview.referrers.reduce((s, r) => s + r.count, 0) || 1;
                  const pct = ((ref.count / total) * 100).toFixed(0);
                  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-amber-500', 'bg-rose-500'];
                  return (
                    <div key={ref.source}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{ref.source}</span>
                        <span className="text-gray-400">{ref.count} ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Content summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Portfolios', value: stats?.portfolioCount || 0 },
                { label: 'Resumes', value: stats?.resumeCount || 0 },
                { label: 'AI Generations', value: stats?.aiGenerations || 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
