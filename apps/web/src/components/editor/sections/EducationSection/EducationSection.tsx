import React from 'react';
import { Button, Input, Label, Card } from '@portfolioai/ui';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import styles from './EducationSection.module.css';

interface EducationSectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export function EducationSection({ data, onUpdate }: EducationSectionProps) {
  const education = data.education || [];

  const addEducation = () => {
    onUpdate({ education: [...education, { school: '', degree: '', startDate: '', endDate: '' }] });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onUpdate({ education: newEdu });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...education];
    newEdu.splice(index, 1);
    onUpdate({ education: newEdu });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Education</h2>
          <p className={styles.subtext}>Your academic background.</p>
        </div>
        <Button variant="outline" size="sm" onClick={addEducation}>
          <Plus className={styles.iconPlus} /> Add Education
        </Button>
      </div>

      <div className={styles.list}>
        {education.length === 0 ? (
          <div className={styles.emptyState}>
            No education added yet.
          </div>
        ) : (
          education.map((edu: any, i: number) => (
            <Card key={i} className={`${styles.card} group`}>
              <div className={styles.dragHandle}>
                <GripVertical className={styles.dragIcon} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.gridContainer}>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>School/University</Label>
                      <Input value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} placeholder="University of Tech" className={styles.inputBold} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Degree</Label>
                      <Input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="BSc Computer Science" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Start Year</Label>
                      <Input value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} placeholder="2016" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>End Year</Label>
                      <Input value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} placeholder="2020" className={styles.input} />
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeEducation(i)} className={styles.deleteButton}>
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
