'use client';

import React from 'react';
import { Sparkles, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button, Input, Label, Card } from '@portfolioai/ui';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface EditorMainProps {
  section: string;
  data: any;
  onUpdate: (updates: any) => void;
}

export function EditorMain({ section, data, onUpdate }: EditorMainProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState('');

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

  const renderBasics = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
        <p className="text-sm text-gray-500">Your professional identity and contact details.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Portfolio Title</Label>
          <Input 
            id="title" 
            name="title" 
            value={data.title || ''} 
            onChange={handleBasicChange}
            placeholder="My Professional Portfolio" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Public Slug</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">p/</span>
            <Input 
              id="slug" 
              name="slug" 
              className="pl-7"
              value={data.slug || ''} 
              onChange={handleBasicChange}
              placeholder="john-doe" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
          <p className="text-sm text-gray-500">Tell your story and highlight your unique value.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isGenerating}
          className="text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
          onClick={handleGenerateBio}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-3.5 w-3.5" />
          )}
          {isGenerating ? 'Drafting...' : 'AI Draft'}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <textarea 
          id="bio"
          name="bio"
          rows={6}
          value={data.bio || ''}
          onChange={handleBasicChange}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          placeholder="Passionate software engineer with 5+ years of experience..."
        />
      </div>
    </div>
  );

  const renderExperience = () => {
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h2>
            <p className="text-sm text-gray-500">Your professional journey and key achievements.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>

        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500">
              No experience added yet.
            </div>
          ) : (
            experiences.map((exp: any, i: number) => (
              <Card key={i} className="p-4 relative group dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                </div>
                <div className="ml-4 flex items-start justify-between">
                  <div className="grid gap-4 flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Company</Label>
                        <Input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Tech Corp" className="h-8 px-2 font-medium focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Role</Label>
                        <Input value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} placeholder="Senior Developer" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Start Date</Label>
                        <Input value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} placeholder="Jan 2020" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">End Date</Label>
                        <Input value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} placeholder="Present" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-gray-400">Description</Label>
                      <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:text-white" rows={3} placeholder="Led development of..." />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeExperience(i)} className="ml-2 h-8 w-8 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
            <p className="text-sm text-gray-500">Showcase your best work.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500">
              No projects added yet.
            </div>
          ) : (
            projects.map((proj: any, i: number) => (
              <Card key={i} className="p-4 relative group dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                </div>
                <div className="ml-4 flex items-start justify-between">
                  <div className="grid gap-4 flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Project Name</Label>
                        <Input value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="Awesome App" className="h-8 px-2 font-medium focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Tech Stack (comma separated)</Label>
                        <Input value={proj.technologies?.join(', ')} onChange={(e) => updateProject(i, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="React, Node.js" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Live URL</Label>
                        <Input value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)} placeholder="https://..." className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">GitHub URL</Label>
                        <Input value={proj.githubUrl} onChange={(e) => updateProject(i, 'githubUrl', e.target.value)} placeholder="https://github.com/..." className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-[10px] uppercase text-gray-400">Description</Label>
                        <button type="button" onClick={() => handleGenerateProject(i, proj)} className="text-[10px] text-blue-600 flex items-center hover:underline disabled:opacity-50" disabled={isGenerating}>
                          <Sparkles className="h-3 w-3 mr-1" /> AI Generate
                        </button>
                      </div>
                      <textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:text-white" rows={3} placeholder="A brief description..." />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(i)} className="ml-2 h-8 w-8 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    const skills = data.skills || [];

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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
          <p className="text-sm text-gray-500">Add your technical and soft skills.</p>
        </div>

        <div className="space-y-4">
          <form onSubmit={addSkill} className="flex gap-2">
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill (e.g. React) and press Enter" className="max-w-md" />
            <Button type="submit" variant="outline">Add</Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill: string) => (
              <div key={skill} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500 rounded-full p-0.5">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-gray-500 italic">No skills added.</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderEducation = () => {
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
            <p className="text-sm text-gray-500">Your academic background.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {education.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500">
              No education added yet.
            </div>
          ) : (
            education.map((edu: any, i: number) => (
              <Card key={i} className="p-4 relative group dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                </div>
                <div className="ml-4 flex items-start justify-between">
                  <div className="grid gap-4 flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">School/University</Label>
                        <Input value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} placeholder="University of Tech" className="h-8 px-2 font-medium focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Degree</Label>
                        <Input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="BSc Computer Science" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">Start Year</Label>
                        <Input value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} placeholder="2016" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-gray-400">End Year</Label>
                        <Input value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} placeholder="2020" className="h-8 px-2 focus-visible:ring-1" />
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(i)} className="ml-2 h-8 w-8 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderAppearance = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-gray-500">Customize how your portfolio looks.</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>Template</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['modern', 'minimal', 'creative'].map(t => (
              <div 
                key={t}
                onClick={() => onUpdate({ template: t })}
                className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${data.template === t || (!data.template && t === 'modern') ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 hover:border-blue-300 dark:border-gray-800'}`}
              >
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded mb-2 w-full mx-auto" />
                <span className="text-sm font-medium capitalize dark:text-white">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Color Theme</Label>
          <div className="flex gap-2">
            {['blue', 'purple', 'emerald', 'rose', 'slate'].map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ theme: { ...data.theme, color } })}
                className={`w-8 h-8 rounded-full border-2 ${data.theme?.color === color || (!data.theme?.color && color === 'blue') ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color === 'blue' ? '#2563eb' : color === 'purple' ? '#9333ea' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#e11d48' : '#64748b' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500">Configure SEO and advanced options.</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input 
            value={data.seoMeta?.title || ''} 
            onChange={(e) => onUpdate({ seoMeta: { ...data.seoMeta, title: e.target.value } })}
            placeholder={data.title || "My Portfolio"} 
          />
        </div>
        <div className="space-y-2">
          <Label>SEO Description</Label>
          <textarea 
            value={data.seoMeta?.description || ''} 
            onChange={(e) => onUpdate({ seoMeta: { ...data.seoMeta, description: e.target.value } })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white" 
            rows={3}
            placeholder={data.bio?.slice(0, 150) || "A brief description for search engines"}
          />
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'basics': return renderBasics();
      case 'about': return renderAbout();
      case 'experience': return renderExperience();
      case 'projects': return renderProjects();
      case 'skills': return renderSkills();
      case 'education': return renderEducation();
      case 'appearance': return renderAppearance();
      case 'settings': return renderSettings();
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
