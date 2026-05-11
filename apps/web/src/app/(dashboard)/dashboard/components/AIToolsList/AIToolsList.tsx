import React from 'react';
import Link from 'next/link';
import { UserCircle, FileText, ClipboardList, Github, Linkedin, ArrowRight } from 'lucide-react';
import styles from './AIToolsList.module.css';

export function AIToolsList() {
  const tools = [
    { title: 'Generate bio', desc: 'Rewrite your About section', icon: UserCircle, iconBg: 'bg-purple-50', iconColor: 'text-purple-700', href: '/ai-tools' },
    { title: 'Optimize resume', desc: 'Target a specific job role', icon: FileText, iconBg: 'bg-sky-50', iconColor: 'text-sky-700', href: '/ai-tools' },
    { title: 'Write case study', desc: 'From your GitHub projects', icon: ClipboardList, iconBg: 'bg-green-50', iconColor: 'text-green-700', href: '/ai-tools' },
    { title: 'Generate README', desc: 'Auto-document your repos', icon: Github, iconBg: 'bg-amber-50', iconColor: 'text-amber-700', href: '/ai-tools' },
    { title: 'Improve LinkedIn', desc: 'Recruiter-optimized summary', icon: Linkedin, iconBg: 'bg-red-50', iconColor: 'text-red-700', href: '/ai-tools' },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>AI tools</h3>
      <div className={styles.list}>
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className={styles.link}
          >
            <div className={`${styles.iconWrapper} ${tool.iconBg}`}>
              <tool.icon className={`${styles.icon} ${tool.iconColor}`} />
            </div>
            <div className={styles.textWrapper}>
              <p className={styles.title}>{tool.title}</p>
              <p className={styles.desc}>{tool.desc}</p>
            </div>
            <ArrowRight className={styles.arrowIcon} />
          </Link>
        ))}
      </div>
    </div>
  );
}
