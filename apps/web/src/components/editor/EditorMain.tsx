'use client';

import React from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

import { BasicsSection } from './sections/BasicsSection/BasicsSection';
import { AboutSection } from './sections/AboutSection/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection/SkillsSection';
import { EducationSection } from './sections/EducationSection/EducationSection';
import { AppearanceSection } from './sections/AppearanceSection/AppearanceSection';
import { SettingsSection } from './sections/SettingsSection/SettingsSection';

interface EditorMainProps {
  section: string;
  data: any;
  onUpdate: (updates: any) => void;
}

export function EditorMain({ section, data, onUpdate }: EditorMainProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post<any>('/ai/generate', {
        type: 'PORTFOLIO_BIO',
        input: {
          name: data.title || 'User',
          role: data.basics?.role || 'Professional',
          skills: data.skills?.join(', ') || 'React, TypeScript, Node.js',
          background: data.bio || '',
        }
      });

      if (response.success && response.data.result) {
        const { headline, detailed_bio } = response.data.result;
        onUpdate({ 
          bio: detailed_bio,
          title: headline || data.title 
        });
        toast.success('AI successfully drafted your bio!');
      }
    } catch (error) {
      toast.error('Failed to generate AI content');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProject = async (index: number, project: any) => {
    setIsGenerating(true);
    try {
      const response = await api.post<any>('/ai/generate', {
        type: 'PROJECT_DESCRIPTION',
        input: {
          projectName: project.name || 'Untitled Project',
          techStack: project.technologies?.join(', ') || '',
          description: project.description || '',
          githubUrl: project.githubUrl || '',
        }
      });

      if (response.success && response.data.result) {
        const newProjects = [...(data.projects || [])];
        newProjects[index] = {
          ...project,
          description: response.data.result.detailed_description,
        };
        onUpdate({ projects: newProjects });
        toast.success('AI successfully described your project!');
      }
    } catch (error) {
      toast.error('Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const renderSection = () => {
    switch (section) {
      case 'basics': return <BasicsSection data={data} onChange={handleBasicChange} />;
      case 'about': return <AboutSection data={data} isGenerating={isGenerating} onGenerateBio={handleGenerateBio} onChange={handleBasicChange} />;
      case 'experience': return <ExperienceSection data={data} onUpdate={onUpdate} />;
      case 'projects': return <ProjectsSection data={data} isGenerating={isGenerating} onGenerateProject={handleGenerateProject} onUpdate={onUpdate} />;
      case 'skills': return <SkillsSection data={data} onUpdate={onUpdate} />;
      case 'education': return <EducationSection data={data} onUpdate={onUpdate} />;
      case 'appearance': return <AppearanceSection data={data} onUpdate={onUpdate} />;
      case 'settings': return <SettingsSection data={data} onUpdate={onUpdate} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Unknown Section</h3>
          </div>
        );
    }
  };

  return (
    <div className="pb-20">
      {renderSection()}
    </div>
  );
}
