import React from 'react';
import { Eye, Download, Sparkles, UserCheck, TrendingUp } from 'lucide-react';
import styles from './StatsGrid.module.css';

interface StatsGridProps {
  stats: any;
  creditsRemaining: number;
  creditsTotal: number;
}

export function StatsGrid({ stats, creditsRemaining, creditsTotal }: StatsGridProps) {
  const statItems = [
    { label: 'Portfolio views', value: stats?.totalViews?.toLocaleString() || '0', change: `${stats?.recentViews || 0} this month`, trend: 'up', icon: Eye },
    { label: 'Resume downloads', value: stats?.totalDownloads?.toLocaleString() || '0', change: 'total downloads', trend: 'up', icon: Download },
    { label: 'AI credits left', value: String(creditsRemaining), change: `of ${creditsTotal}/month`, trend: 'flat', icon: Sparkles },
    { label: 'Portfolios', value: String(stats?.portfolioCount || 0), change: `${stats?.aiGenerations || 0} AI generations`, trend: 'up', icon: UserCheck },
  ];

  return (
    <div className={styles.grid}>
      {statItems.map((stat) => (
        <div key={stat.label} className={styles.card}>
          <div className={styles.labelWrapper}>
            <stat.icon className={styles.icon} />
            {stat.label}
          </div>
          <div className={styles.value}>{stat.value}</div>
          <div className={`${styles.trendWrapper} ${
            stat.trend === 'up' ? styles.trendUp : stat.trend === 'down' ? styles.trendDown : styles.trendFlat
          }`}>
            {stat.trend === 'up' && <TrendingUp className={styles.trendIcon} />}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
