import React from 'react';
import { Input, Label } from '@portfolioai/ui';
import styles from './BasicsSection.module.css';

interface BasicsSectionProps {
  data: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicsSection({ data, onChange }: BasicsSectionProps) {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>Basic Information</h2>
        <p className={styles.subtext}>Your professional identity and contact details.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <Label htmlFor="title">Portfolio Title</Label>
          <Input 
            id="title" 
            name="title" 
            value={data.title || ''} 
            onChange={onChange}
            placeholder="My Professional Portfolio" 
          />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="slug">Public Slug</Label>
          <div className={styles.relativeWrap}>
            <span className={styles.slugPrefix}>p/</span>
            <Input 
              id="slug" 
              name="slug" 
              className={styles.slugInput}
              value={data.slug || ''} 
              onChange={onChange}
              placeholder="john-doe" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
