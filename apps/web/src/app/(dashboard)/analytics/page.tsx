import { BarChart3, Eye, Download, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">Track your portfolio performance and engagement</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: 'Total Views', value: '12,847', change: '+24%', icon: Eye },
          { label: 'Downloads', value: '342', change: '+12%', icon: Download },
          { label: 'Unique Visitors', value: '8,201', change: '+18%', icon: Users },
          { label: 'Engagement Rate', value: '4.2%', change: '+0.3%', icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
            <div className="mt-2 text-2xl font-medium text-gray-900">{s.value}</div>
            <div className="mt-1 text-xs text-green-600">{s.change} this month</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200/60 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Views over time</h3>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            <button className="rounded-md bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm">7 days</button>
            <button className="rounded-md px-3 py-1 text-xs text-gray-500">30 days</button>
            <button className="rounded-md px-3 py-1 text-xs text-gray-500">90 days</button>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          <BarChart3 className="mr-2 h-5 w-5" /> Chart visualization will render here
        </div>
      </div>
    </div>
  );
}
