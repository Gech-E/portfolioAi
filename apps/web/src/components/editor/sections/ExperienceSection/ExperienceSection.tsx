import React from 'react';
import { Button, Input, Label, Card } from '@portfolioai/ui';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import styles from './ExperienceSection.module.css';

interface ExperienceSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function ExperienceSection({ data, onUpdate }: ExperienceSectionProps) {
  const experiences = data.experience || [];

  const addExperience = () => {
    onUpdate({ experience: [...experiences, { company: '', role: '', description: '', startDate: '', endDate: '' }] });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...experiences];
    newExp[index] = { ...newExp[index], [field]: value };
    onUpdate({ experience: newExp });
  };

  const removeExperience = (index: number) => {
    const newExp = [...experiences];
    newExp.splice(index, 1);
    onUpdate({ experience: newExp });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Work Experience</h2>
          <p className={styles.subtext}>Your professional journey and key achievements.</p>
        </div>
        <Button variant="outline" size="sm" onClick={addExperience}>
          <Plus className={styles.iconPlus} /> Add Role
        </Button>
      </div>

      <div className={styles.list}>
        {experiences.length === 0 ? (
          <div className={styles.emptyState}>
            No experience added yet.
          </div>
        ) : (
          experiences.map((exp: any, i: number) => (
            <Card key={i} className={`${styles.card} group`}>
              <div className={styles.dragHandle}>
                <GripVertical className={styles.dragIcon} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.gridContainer}>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Company</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Tech Corp" className={styles.inputBold} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Role</Label>
                      <Input value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} placeholder="Senior Developer" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Start Date</Label>
                      <Input value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} placeholder="Jan 2020" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>End Date</Label>
                      <Input value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} placeholder="Present" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <Label className={styles.label}>Description</Label>
                    <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} className={styles.textarea} rows={3} placeholder="Led development of..." />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeExperience(i)} className={styles.deleteButton}>
                  <Trash2 className={styles.deleteIcon} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
