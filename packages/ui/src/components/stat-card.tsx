import * as React from 'react';
import { cn } from '../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: LucideIcon;
  className?: string;
}

function StatCard({ label, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <div className="mt-2 text-2xl font-medium text-gray-900 dark:text-white">{value}</div>
      {change && (
        <div
          className={cn('mt-1 text-xs', {
            'text-green-600 dark:text-green-400': trend === 'up',
            'text-red-600 dark:text-red-400': trend === 'down',
            'text-gray-400 dark:text-gray-500': trend === 'flat' || !trend,
          })}
        >
          {change}
        </div>
      )}
    </div>
  );
}

export { StatCard };
export type { StatCardProps };
