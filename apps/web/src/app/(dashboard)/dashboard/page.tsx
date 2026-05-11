'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Eye, Download, Sparkles, UserCheck, TrendingUp,
  Code, Palette, Bot, PenLine,
  UserCircle, FileText, ClipboardList, Github, Linkedin, ArrowRight,
  Globe, Check, Loader2,
} from 'lucide-react';
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

  const portfolioIcons = [
    { icon: Code, iconColor: 'text-purple-700', iconBg: 'bg-purple-50' },
    { icon: Palette, iconColor: 'text-sky-700', iconBg: 'bg-sky-50' },
    { icon: Bot, iconColor: 'text-green-700', iconBg: 'bg-green-50' },
    { icon: PenLine, iconColor: 'text-amber-700', iconBg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-7">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Portfolio views', value: stats?.totalViews?.toLocaleString() || '0', change: `${stats?.recentViews || 0} this month`, trend: 'up', icon: Eye },
          { label: 'Resume downloads', value: stats?.totalDownloads?.toLocaleString() || '0', change: 'total downloads', trend: 'up', icon: Download },
          { label: 'AI credits left', value: String(creditsRemaining), change: `of ${credits?.total || 0}/month`, trend: 'flat', icon: Sparkles },
          { label: 'Portfolios', value: String(stats?.portfolioCount || 0), change: `${stats?.aiGenerations || 0} AI generations`, trend: 'up', icon: UserCheck },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900"
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <stat.icon className="h-3.5 w-3.5" />
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-medium text-gray-900 dark:text-white">{stat.value}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-xs ${
              stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}>
              {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-5">
          {/* My Portfolios */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">My portfolios</h3>
              <Link href="/portfolio/new" className="text-xs text-blue-600 hover:underline font-medium">
                + New
              </Link>
            </div>
            {portfolios.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                <Globe className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                No portfolios yet. <Link href="/portfolio/new" className="text-blue-600 hover:underline">Create one</Link>
              </div>
            ) : (
              portfolios.slice(0, 4).map((p, idx) => {
                const iconSet = portfolioIcons[idx % portfolioIcons.length];
                return (
                  <Link href={`/portfolio/${p.id}/editor`} key={p.id} className="flex items-center gap-3 border-b border-gray-100 py-2.5 last:border-b-0 last:pb-0 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 -mx-2 transition-colors">
                    <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg ${iconSet.iconBg}`}>
                      <iconSet.icon className={`h-[17px] w-[17px] ${iconSet.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">{p.title || p.slug}</p>
                      <p className="text-xs text-gray-400">{p.slug}.portfolioai.com</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>{p.status === 'PUBLISHED' ? 'Live' : 'Draft'}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                      {p.viewCount > 0 && <Eye className="h-3 w-3" />} {p.viewCount > 0 ? p.viewCount.toLocaleString() : '—'}
                    </span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Skill Profile */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Skill profile</h3>
              <span className="text-xs text-gray-400">Based on GitHub + LinkedIn</span>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {[
                { skill: 'React / Next.js', level: 92 },
                { skill: 'Python', level: 78 },
                { skill: 'Node.js', level: 85 },
                { skill: 'TypeScript', level: 80 },
                { skill: 'PostgreSQL', level: 65, warn: true },
                { skill: 'Docker / K8s', level: 55, warn: true },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{s.skill}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{s.level}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${s.warn ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/career-roadmap" className="mt-4 block w-full rounded-lg border border-gray-200 py-2 text-center text-[13px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Run AI skill gap analysis ↗
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* AI Tools */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">AI tools</h3>
            <div className="space-y-2.5">
              {[
                { title: 'Generate bio', desc: 'Rewrite your About section', icon: UserCircle, iconBg: 'bg-purple-50', iconColor: 'text-purple-700', href: '/ai-tools' },
                { title: 'Optimize resume', desc: 'Target a specific job role', icon: FileText, iconBg: 'bg-sky-50', iconColor: 'text-sky-700', href: '/ai-tools' },
                { title: 'Write case study', desc: 'From your GitHub projects', icon: ClipboardList, iconBg: 'bg-green-50', iconColor: 'text-green-700', href: '/ai-tools' },
                { title: 'Generate README', desc: 'Auto-document your repos', icon: Github, iconBg: 'bg-amber-50', iconColor: 'text-amber-700', href: '/ai-tools' },
                { title: 'Improve LinkedIn', desc: 'Recruiter-optimized summary', icon: Linkedin, iconBg: 'bg-red-50', iconColor: 'text-red-700', href: '/ai-tools' },
              ].map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tool.iconBg}`}>
                    <tool.icon className={`h-[17px] w-[17px] ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white">{tool.title}</p>
                    <p className="text-xs text-gray-400">{tool.desc}</p>
                  </div>
                  <ArrowRight className="h-[15px] w-[15px] text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* ATS Score */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Resume ATS score</h3>
            <div className="flex flex-col items-center py-4">
              <div className="relative" style={{ width: 88, height: 88 }}>
                <svg width={88} height={88} viewBox="0 0 88 88" fill="none">
                  <circle cx="44" cy="44" r="36" stroke="#f3f4f6" strokeWidth="8" className="dark:stroke-gray-800" />
                  <circle cx="44" cy="44" r="36" stroke="#2563EB" strokeWidth="8" strokeDasharray="226" strokeDashoffset="59" strokeLinecap="round" transform="rotate(-90 44 44)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-medium text-gray-900 dark:text-white">74</span>
                  <span className="text-[10px] text-gray-400">/ 100</span>
                </div>
              </div>
              <p className="mt-2.5 text-center text-[13px] text-gray-500">Good — minor improvements will push you to 85+</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"><Check className="h-2.5 w-2.5" />Keywords matched</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"><Check className="h-2.5 w-2.5" />Formatting</span>
              <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-700">Weak action verbs</span>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">Missing: AWS cert</span>
            </div>
            <Link href="/ai-tools" className="mt-4 block w-full rounded-lg border border-gray-200 py-2 text-center text-[13px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Auto-fix with AI ↗
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Recent activity</h3>
            <div className="space-y-0">
              {[
                { text: 'AI generated your portfolio bio', time: '2 hours ago', icon: Sparkles, iconBg: 'bg-purple-50', iconColor: 'text-purple-700' },
                { text: 'Portfolio published', time: 'Yesterday', icon: Globe, iconBg: 'bg-green-50', iconColor: 'text-green-700' },
                { text: 'GitHub repos imported', time: '2 days ago', icon: Github, iconBg: 'bg-sky-50', iconColor: 'text-sky-700' },
                { text: 'Resume optimized for SE role', time: '3 days ago', icon: FileText, iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 border-b border-gray-100 py-2.5 last:border-b-0 dark:border-gray-800">
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                    <item.icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-900 dark:text-white">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
