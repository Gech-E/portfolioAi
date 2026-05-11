import React from 'react';
import { Input, Label } from '@portfolioai/ui';
import styles from './SettingsSection.module.css';

interface SettingsSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function SettingsSection({ data, onUpdate }: SettingsSectionProps) {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>Settings</h2>
        <p className={styles.subtext}>Configure SEO and advanced options.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <Label>SEO Title</Label>
          <Input 
            value={data.seoMeta?.title || ''} 
            onChange={(e) => onUpdate({ seoMeta: { ...data.seoMeta, title: e.target.value } })}
            placeholder={data.title || "My Portfolio"} 
          />
        </div>
        <div className={styles.inputGroup}>
          <Label>SEO Description</Label>
          <textarea 
            value={data.seoMeta?.description || ''} 
            onChange={(e) => onUpdate({ seoMeta: { ...data.seoMeta, description: e.target.value } })}
            className={styles.textarea} 
            rows={3}
            placeholder={data.bio?.slice(0, 150) || "A brief description for search engines"}
          />
        </div>
      </div>
    </div>
  );
}
