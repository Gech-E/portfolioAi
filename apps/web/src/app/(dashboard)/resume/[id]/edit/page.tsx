'use client';

import { useState, useEffect, use } from 'react';
import { 
  Save, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Download, 
  Eye, 
  Layout, 
  Type, 
  Loader2, 
  GripVertical,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface ResumeSection {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';
  title: string;
  content: any;
}

interface Resume {
  id: string;
  title: string;
  targetRole: string | null;
  jobDescription: string | null;
  sections: ResumeSection[];
  atsScore: any | null;
}

export default function ResumeEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await api.get<Resume>(`/resumes/${id}`);
      setResume(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await api.patch(`/resumes/${id}`, {
        title: resume.title,
        targetRole: resume.targetRole,
        jobDescription: resume.jobDescription,
        sections: resume.sections,
      });
      toast.success('Resume saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    if (!resume?.jobDescription) {
      toast.error('Please provide a job description for optimization');
      return;
    }
    setOptimizing(true);
    try {
      const response = await api.post<any>(`/resumes/${id}/optimize`, {
        jobDescription: resume.jobDescription,
      });
      toast.success('AI Optimization complete!');
      // In a real app, we'd update the content with AI suggestions
      console.log('AI Optimization Result:', response.data);
    } catch (error: any) {
      toast.error('AI optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  if (!resume) return <div>Resume not found</div>;

  return (
    <div className="h-full flex flex-col -mt-4 -mx-4 md:-mx-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/resume" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="text-lg font-bold bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white max-w-[200px] md:max-w-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Editor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 border-r border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Target Settings */}
            <section className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold uppercase tracking-wider text-xs">AI Optimization Engine</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    value={resume.targetRole || ''}
                    onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Description</label>
                  <textarea
                    rows={4}
                    placeholder="Paste the job description here..."
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    value={resume.jobDescription || ''}
                    onChange={(e) => setResume({ ...resume, jobDescription: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing ATS Compatibility...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Optimize for this Role
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Resume Content Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Resume Content</h3>
                <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>
              
              {resume.sections.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
                  <p className="text-gray-500">Your resume is empty. Start adding sections or use AI to generate content.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Placeholder for section list */}
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                    Personal Information (Always at top)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="hidden lg:block w-[450px] bg-gray-50 dark:bg-gray-900 overflow-y-auto p-8">
          <div className="sticky top-0 mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Live Preview</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <Layout className="h-4 w-4" />
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <Type className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="aspect-[1/1.414] w-full bg-white shadow-2xl rounded-sm p-12 overflow-hidden flex flex-col gap-6">
            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
            <div className="mt-8 space-y-4">
              <div className="h-3 w-full bg-gray-50 rounded"></div>
              <div className="h-3 w-full bg-gray-50 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-50 rounded"></div>
            </div>
            <div className="mt-12 space-y-4">
              <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
              <div className="h-3 w-full bg-gray-50 rounded"></div>
              <div className="h-3 w-full bg-gray-50 rounded"></div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 italic">Select a template to change the layout</p>
        </div>
      </div>
    </div>
  );
}
