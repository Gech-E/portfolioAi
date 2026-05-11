import React from 'react';
import { Button, Input } from '@portfolioai/ui';
import { Trash2 } from 'lucide-react';
import styles from './SkillsSection.module.css';

interface SkillsSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function SkillsSection({ data, onUpdate }: SkillsSectionProps) {
  const skills = data.skills || [];
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = (e: React.KeyboardEvent | React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onUpdate({ skills: [...skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate({ skills: skills.filter((s: string) => s !== skill) });
  };

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>Skills</h2>
        <p className={styles.subtext}>Add your technical and soft skills.</p>
      </div>

      <div className={styles.content}>
        <form onSubmit={addSkill} className={styles.form}>
          <Input 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            placeholder="Add a skill (e.g. React) and press Enter" 
            className={styles.input} 
          />
          <Button type="submit" variant="outline">Add</Button>
        </form>

        <div className={styles.skillsList}>
          {skills.map((skill: string) => (
            <div key={skill} className={styles.skillItem}>
              <span>{skill}</span>
              <button type="button" onClick={() => removeSkill(skill)} className={styles.removeButton}>
                <Trash2 className={styles.removeIcon} />
              </button>
            </div>
          ))}
          {skills.length === 0 && <p className={styles.emptyState}>No skills added.</p>}
        </div>
      </div>
    </div>
  );
}
