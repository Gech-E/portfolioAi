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

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post<any>('/ai/generate', {
        type: 'PORTFOLIO_BIO',
        input: {
          name: data.title || 'User',
          role: data.basics?.role || 'Professional',
          skills: 'React, TypeScript, Node.js', // Placeholder for now
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

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const handleDeepChange = (parent: string, field: string, value: any) => {
    onUpdate({
      [parent]: {
        ...data[parent],
        [field]: value,
      }
    });
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="theme">Template</Label>
          <select 
            id="theme"
            name="template"
            value={data.template || 'modern'}
            onChange={(e) => onUpdate({ template: e.target.value })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-950"
          >
            <option value="modern">Modern Professional</option>
            <option value="minimal">Minimalist</option>
            <option value="creative">Creative Developer</option>
            <option value="executive">Executive</option>
          </select>
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
          className="text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50"
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
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-950"
          placeholder="Passionate software engineer with 5+ years of experience..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h2>
          <p className="text-sm text-gray-500">Your professional journey and key achievements.</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="space-y-4">
        {/* Mocking a list for now */}
        {[1].map((_, i) => (
          <Card key={i} className="p-4 relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-300" />
            </div>
            <div className="ml-4 flex items-start justify-between">
              <div className="grid gap-4 flex-1 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-gray-400">Company</Label>
                  <Input placeholder="Tech Corp" variant="ghost" className="h-8 px-0 font-medium" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-gray-400">Role</Label>
                  <Input placeholder="Senior Developer" variant="ghost" className="h-8 px-0" />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'basics': return renderBasics();
      case 'about': return renderAbout();
      case 'experience': return renderExperience();
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
              This section editor is currently under development.
            </p>
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
