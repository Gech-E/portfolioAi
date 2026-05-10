'use client';

import { useState } from 'react';
import { Sparkles, UserCircle, FileText, ClipboardList, Github, Linkedin, Route, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const tools = [
  { title: 'Generate Bio', desc: 'Create a professional About section powered by AI', icon: UserCircle, color: 'bg-purple-50 text-purple-700', credits: 1 },
  { title: 'Optimize Resume', desc: 'ATS-optimize your resume for a target role', icon: FileText, color: 'bg-sky-50 text-sky-700', credits: 3 },
  { title: 'Write Case Study', desc: 'Turn your projects into compelling case studies', icon: ClipboardList, color: 'bg-green-50 text-green-700', credits: 3 },
  { title: 'Generate README', desc: 'Auto-generate documentation for GitHub repos', icon: Github, color: 'bg-amber-50 text-amber-700', credits: 1 },
  { type: 'LINKEDIN_SUMMARY', title: 'LinkedIn Summary', desc: 'Create a recruiter-optimized LinkedIn summary', icon: Linkedin, color: 'bg-red-50 text-red-700', credits: 1 },
  { type: 'SKILL_ANALYSIS', title: 'Career Roadmap', desc: 'Get a personalized skill development plan', icon: Route, color: 'bg-cyan-50 text-cyan-700', credits: 4 },
];

export default function AIToolsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (type: string, credits: number) => {
    setGenerating(type);
    toast.info('Starting AI generation...', { id: `gen-${type}` });
    
    try {
      const response = await api.post<any>('/ai/generate', {
        type,
        input: {
          name: 'Alex Johnson', // mock input for now
          role: 'Full-Stack Developer',
          skills: 'React, Node.js, Python',
          experience: '5 years',
          tone: 'Professional and confident'
        }
      });
      
      if (response.success) {
        toast.success(`Successfully generated ${type.toLowerCase()}`, { id: `gen-${type}` });
      }
    } catch (error: any) {
      toast.error(error.message || 'Generation failed', { id: `gen-${type}` });
    } finally {
      setGenerating(null);
    }
  };
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">AI Tools</h2>
        <p className="mt-1 text-sm text-gray-500">Supercharge your career with AI-powered tools</p>
      </div>
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-blue-700"><strong>38 AI credits</strong> remaining this month (50/month on Pro plan)</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button 
            key={tool.title} 
            onClick={() => handleGenerate(tool.type, tool.credits)}
            disabled={generating !== null}
            className="group flex flex-col rounded-xl border border-gray-200/60 bg-white p-6 text-left transition-all hover:border-blue-200 hover:shadow-lg disabled:opacity-50 disabled:hover:border-gray-200/60 disabled:hover:shadow-none dark:border-gray-700/60 dark:bg-gray-900"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tool.color}`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{tool.desc}</p>
            <div className="mt-auto flex items-center justify-between pt-4 w-full">
              <span className="text-[11px] text-gray-400">{tool.credits} credit{tool.credits > 1 ? 's' : ''}</span>
              {generating === tool.type ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
