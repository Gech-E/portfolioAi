import React from 'react';
import { Label } from '@portfolioai/ui';
import styles from './AppearanceSection.module.css';

interface AppearanceSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function AppearanceSection({ data, onUpdate }: AppearanceSectionProps) {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>Appearance</h2>
        <p className={styles.subtext}>Customize how your portfolio looks.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <Label>Template</Label>
          <div className={styles.templateGrid}>
            {['modern', 'minimal', 'creative'].map(t => (
              <div 
                key={t}
                onClick={() => onUpdate({ template: t })}
                className={`${styles.templateCard} ${data.template === t || (!data.template && t === 'modern') ? styles.templateSelected : styles.templateUnselected}`}
              >
                <div className={styles.templateImagePlaceholder} />
                <span className={styles.templateName}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <Label>Color Theme</Label>
          <div className={styles.colorRow}>
            {['blue', 'purple', 'emerald', 'rose', 'slate'].map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ theme: { ...data.theme, color } })}
                className={`${styles.colorButton} ${data.theme?.color === color || (!data.theme?.color && color === 'blue') ? styles.colorSelected : styles.colorUnselected}`}
                style={{ backgroundColor: color === 'blue' ? '#2563eb' : color === 'purple' ? '#9333ea' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#e11d48' : '#64748b' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
