'use client';

import { Globe, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function PortfolioPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => api.get<{ data: any[] }>('/portfolios').then((res) => res.data),
  });
  return (
    <div className="animate-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Portfolios</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and create your professional portfolios</p>
        </div>
        <Link href="/portfolio/new" className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> New Portfolio
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load portfolios
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="rounded-xl border border-gray-200 border-dashed bg-gray-50 p-12 text-center">
          <Globe className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No portfolios yet</h3>
          <p className="mt-1 text-xs text-gray-500">Create your first portfolio to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((portfolio: any) => (
            <Link href={`/portfolio/${portfolio.id}/editor`} key={portfolio.id} className="group rounded-xl border border-gray-200/60 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
              <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <Globe className="h-10 w-10 text-blue-300" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">{portfolio.title || portfolio.slug}</h3>
              <p className="mt-1 text-xs text-gray-400">
                {portfolio._count?.views || 0} views • {portfolio.template}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
