import React from 'react';
import { Button, Label } from '@portfolioai/ui';
import { Loader2, Sparkles } from 'lucide-react';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  data: any;
  isGenerating: boolean;
  onGenerateBio: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AboutSection({ data, isGenerating, onGenerateBio, onChange }: AboutSectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>About Me</h2>
          <p className={styles.subtext}>Tell your story and highlight your unique value.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isGenerating}
          className={styles.generateButton}
          onClick={onGenerateBio}
        >
          {isGenerating ? (
            <Loader2 className={styles.iconSpin} />
          ) : (
            <Sparkles className={styles.icon} />
          )}
          {isGenerating ? 'Drafting...' : 'AI Draft'}
        </Button>
      </div>

      <div className={styles.inputGroup}>
        <Label htmlFor="bio">Professional Bio</Label>
        <textarea 
          id="bio"
          name="bio"
          rows={6}
          value={data.bio || ''}
          onChange={onChange}
          className={styles.textarea}
          placeholder="Passionate software engineer with 5+ years of experience..."
        />
      </div>
    </div>
  );
}
