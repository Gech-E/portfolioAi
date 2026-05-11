'use client';

import { useState, useEffect } from 'react';
import { Sparkles, UserCircle, FileText, ClipboardList, Github, Linkedin, Route, ArrowRight, Loader2, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const tools = [
  { type: 'PORTFOLIO_BIO', title: 'Generate Bio', desc: 'Create a professional About section powered by AI', icon: UserCircle, color: 'bg-purple-50 text-purple-700', credits: 1 },
  { type: 'RESUME_OPTIMIZE', title: 'Optimize Resume', desc: 'ATS-optimize your resume for a target role', icon: FileText, color: 'bg-sky-50 text-sky-700', credits: 3 },
  { type: 'CASE_STUDY', title: 'Write Case Study', desc: 'Turn your projects into compelling case studies', icon: ClipboardList, color: 'bg-green-50 text-green-700', credits: 3 },
  { type: 'README', title: 'Generate README', desc: 'Auto-generate documentation for GitHub repos', icon: Github, color: 'bg-amber-50 text-amber-700', credits: 1 },
  { type: 'LINKEDIN_SUMMARY', title: 'LinkedIn Summary', desc: 'Create a recruiter-optimized LinkedIn summary', icon: Linkedin, color: 'bg-red-50 text-red-700', credits: 1 },
  { type: 'CAREER_ROADMAP', title: 'Career Roadmap', desc: 'Get a personalized skill development plan', icon: Route, color: 'bg-cyan-50 text-cyan-700', credits: 4 },
];

export default function AIToolsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [credits, setCredits] = useState<{ total: number; used: number } | null>(null);
  const [activeResult, setActiveResult] = useState<{ type: string; title: string; data: any; id: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await api.get<any>('/ai/credits');
      if (response.success) {
        setCredits(response.data);
      }
    } catch {
      // Use fallback
      setCredits({ total: 50, used: 12 });
    }
  };

  const handleGenerate = async (type: string, title: string) => {
    setGenerating(type);
    setActiveResult(null);
    setFeedbackGiven(false);
    toast.info('Starting AI generation...', { id: `gen-${type}` });
    
    try {
      // For MVP, we pass generic context. In a full app, this would open a modal for specific inputs.
      const response = await api.post<any>('/ai/generate', {
        type,
        input: {
          name: 'Current User',
          role: 'Software Engineer',
          skills: 'React, Node.js, TypeScript',
          context: 'General career growth',
          projectName: 'PortfolioAI',
          description: 'A platform to generate portfolios'
        }
      });
      
      if (response.success && response.data) {
        toast.success(`Successfully generated ${title.toLowerCase()}`, { id: `gen-${type}` });
        setActiveResult({
          type,
          title,
          data: response.data.result,
          id: response.data.generationId || Date.now().toString()
        });
        fetchCredits(); // Refresh credits
      }
    } catch (error: any) {
      toast.error(error.message || 'Generation failed', { id: `gen-${type}` });
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = () => {
    if (!activeResult?.data) return;
    const text = typeof activeResult.data === 'string' 
      ? activeResult.data 
      : JSON.stringify(activeResult.data, null, 2);
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const submitFeedback = async (rating: 'good' | 'bad') => {
    if (!activeResult?.id || feedbackGiven) return;
    try {
      await api.post(`/ai/generations/${activeResult.id}/feedback`, { rating });
      setFeedbackGiven(true);
      toast.success('Thanks for your feedback!');
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const remaining = credits ? credits.total - credits.used : 0;

  return (
    <div className="animate-in space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Tools</h2>
        <p className="mt-1 text-sm text-gray-500">Supercharge your career with AI-powered tools</p>
      </div>

      {credits && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{remaining} AI credits</strong> remaining this month (out of {credits.total})
            </span>
          </div>
          <div className="w-full sm:w-48 bg-blue-100 dark:bg-blue-900 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${Math.max(0, Math.min(100, (remaining / credits.total) * 100))}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results View */}
      {activeResult && (
        <div className="rounded-xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-900/50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 flex items-center justify-between border-b border-green-100 dark:border-green-900/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-medium text-green-900 dark:text-green-300">Generated: {activeResult.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 hover:bg-gray-50 transition-colors text-gray-600 dark:text-gray-300"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setActiveResult(null)}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-950 overflow-auto max-h-[400px]">
            {typeof activeResult.data === 'string' ? (
              <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{activeResult.data}</p>
            ) : (
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                {JSON.stringify(activeResult.data, null, 2)}
              </pre>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">Was this helpful?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => submitFeedback('good')}
                disabled={feedbackGiven}
                className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 disabled:opacity-50 transition-colors"
              >
                👍 Good
              </button>
              <button 
                onClick={() => submitFeedback('bad')}
                disabled={feedbackGiven}
                className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 disabled:opacity-50 transition-colors"
              >
                👎 Needs work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button 
            key={tool.title} 
            onClick={() => handleGenerate(tool.type, tool.title)}
            disabled={generating !== null || remaining < tool.credits}
            className="group flex flex-col rounded-xl border border-gray-200/60 bg-white p-6 text-left transition-all hover:border-blue-200 hover:shadow-lg disabled:opacity-50 disabled:hover:border-gray-200/60 disabled:hover:shadow-none dark:border-gray-700/60 dark:bg-gray-900"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tool.color}`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{tool.desc}</p>
            <div className="mt-auto flex items-center justify-between pt-4 w-full">
              <span className={`text-[11px] font-medium ${remaining < tool.credits ? 'text-red-500' : 'text-gray-400'}`}>
                {tool.credits} credit{tool.credits > 1 ? 's' : ''}
              </span>
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
