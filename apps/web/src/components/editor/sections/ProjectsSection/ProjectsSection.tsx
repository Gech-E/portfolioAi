import React from 'react';
import { Button, Input, Label, Card } from '@portfolioai/ui';
import { Plus, GripVertical, Trash2, Sparkles } from 'lucide-react';
import styles from './ProjectsSection.module.css';

interface ProjectsSectionProps {
  data: any;
  isGenerating: boolean;
  onGenerateProject: (index: number, project: any) => void;
  onUpdate: (updates: any) => void;
}

export function ProjectsSection({ data, isGenerating, onGenerateProject, onUpdate }: ProjectsSectionProps) {
  const projects = data.projects || [];

  const addProject = () => {
    onUpdate({ projects: [...projects, { name: '', description: '', technologies: [], link: '', githubUrl: '' }] });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newProj = [...projects];
    newProj[index] = { ...newProj[index], [field]: value };
    onUpdate({ projects: newProj });
  };

  const removeProject = (index: number) => {
    const newProj = [...projects];
    newProj.splice(index, 1);
    onUpdate({ projects: newProj });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Projects</h2>
          <p className={styles.subtext}>Showcase your best work.</p>
        </div>
        <Button variant="outline" size="sm" onClick={addProject}>
          <Plus className={styles.iconPlus} /> Add Project
        </Button>
      </div>

      <div className={styles.list}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            No projects added yet.
          </div>
        ) : (
          projects.map((proj: any, i: number) => (
            <Card key={i} className={styles.card}>
              <div className={styles.dragHandle}>
                <GripVertical className={styles.dragIcon} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.gridContainer}>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Project Name</Label>
                      <Input value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="Awesome App" className={styles.inputBold} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Tech Stack (comma separated)</Label>
                      <Input value={proj.technologies?.join(', ')} onChange={(e) => updateProject(i, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="React, Node.js" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>Live URL</Label>
                      <Input value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)} placeholder="https://..." className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Label className={styles.label}>GitHub URL</Label>
                      <Input value={proj.githubUrl} onChange={(e) => updateProject(i, 'githubUrl', e.target.value)} placeholder="https://github.com/..." className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <div className={styles.descriptionHeader}>
                      <Label className={styles.label}>Description</Label>
                      <button type="button" onClick={() => onGenerateProject(i, proj)} className={styles.aiButton} disabled={isGenerating}>
                        <Sparkles className={styles.aiIcon} /> AI Generate
                      </button>
                    </div>
                    <textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} className={styles.textarea} rows={3} placeholder="A brief description..." />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeProject(i)} className={styles.deleteButton}>
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
