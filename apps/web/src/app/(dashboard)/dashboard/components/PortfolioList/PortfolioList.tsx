import React from 'react';
import Link from 'next/link';
import { Globe, Eye, Code, Palette, Bot, PenLine } from 'lucide-react';
import styles from './PortfolioList.module.css';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
}

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export function PortfolioList({ portfolios }: PortfolioListProps) {
  const portfolioIcons = [
    { icon: Code, iconColor: 'text-purple-700', iconBg: 'bg-purple-50' },
    { icon: Palette, iconColor: 'text-sky-700', iconBg: 'bg-sky-50' },
    { icon: Bot, iconColor: 'text-green-700', iconBg: 'bg-green-50' },
    { icon: PenLine, iconColor: 'text-amber-700', iconBg: 'bg-amber-50' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading}>My portfolios</h3>
        <Link href="/portfolio/new" className={styles.newLink}>
          + New
        </Link>
      </div>
      {portfolios.length === 0 ? (
        <div className={styles.emptyState}>
          <Globe className={styles.emptyIcon} />
          No portfolios yet. <Link href="/portfolio/new" className={styles.createLink}>Create one</Link>
        </div>
      ) : (
        portfolios.slice(0, 4).map((p, idx) => {
          const iconSet = portfolioIcons[idx % portfolioIcons.length];
          return (
            <Link href={`/portfolio/${p.id}/editor`} key={p.id} className={styles.listItem}>
              <div className={`${styles.iconWrapper} ${iconSet.iconBg}`}>
                <iconSet.icon className={`${styles.icon} ${iconSet.iconColor}`} />
              </div>
              <div className={styles.infoWrapper}>
                <p className={styles.title}>{p.title || p.slug}</p>
                <p className={styles.slug}>{p.slug}.portfolioai.com</p>
              </div>
              <span className={`${styles.statusBadge} ${
                p.status === 'PUBLISHED' ? styles.statusLive : styles.statusDraft
              }`}>{p.status === 'PUBLISHED' ? 'Live' : 'Draft'}</span>
              <span className={styles.viewCount}>
                {p.viewCount > 0 && <Eye className={styles.eyeIcon} />} {p.viewCount > 0 ? p.viewCount.toLocaleString() : '—'}
              </span>
            </Link>
          );
        })
      )}
    </div>
  );
}
