'use client';

import { useState } from 'react';
import { Route, Target, BookOpen, Award, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Milestone {
  title: string;
  description: string;
  resources: string[];
  duration: string;
}

interface Roadmap {
  id: string;
  currentRole: string;
  targetRole: string;
  timelineMonths: number;
  milestones: Milestone[];
  status: string;
}

export default function CareerRoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [formData, setFormData] = useState({
    currentRole: '',
    targetRole: '',
    timelineMonths: 6,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentRole || !formData.targetRole) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<Roadmap>('/career/roadmaps/generate', formData);
      setRoadmap(response.data);
      toast.success('Career roadmap generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career Roadmap</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">AI-powered career path and skill development plan</p>
      </div>

      {!roadmap ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Route className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Plan Your Career Path</h3>
          <p className="mt-2 text-center text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Tell us your goals, and our AI will analyze your profile and market trends to build a step-by-step roadmap for you.
          </p>

          <form onSubmit={handleGenerate} className="mt-8 space-y-6 max-w-lg mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Role</label>
                <input
                  type="text"
                  placeholder="e.g. Junior Developer"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Architect"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline (Months)</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                value={formData.timelineMonths}
                onChange={(e) => setFormData({ ...formData, timelineMonths: parseInt(e.target.value) })}
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                'Generate Personalized Roadmap'
              )}
            </button>
            <p className="text-center text-xs text-gray-400">Costs 4 AI Credits</p>
          </form>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setRoadmap(null)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              â† Generate New Roadmap
            </button>
            <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {roadmap.status}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold">{roadmap.currentRole} â†’ {roadmap.targetRole}</h3>
            <p className="mt-2 opacity-90">A {roadmap.timelineMonths}-month strategic plan to achieve your career goals.</p>
            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium">Goal Focused</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">{roadmap.milestones.length} Milestones</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block"></div>
            <div className="space-y-12">
              {roadmap.milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative md:pl-20"
                >
                  <div className="absolute left-6 md:left-6 top-0 hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-900 z-10">
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Milestone {index + 1} â€¢ {milestone.duration}</span>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{milestone.title}</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-gray-200 dark:text-gray-700" />
                      </div>
                    </div>

                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recommended Resources</h5>
                        <div className="flex flex-wrap gap-2">
                          {milestone.resources.map((resource, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              <BookOpen className="h-3 w-3" />
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
            <h4 className="font-bold text-gray-900 dark:text-white">Ready to start?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your progress and update your portfolio as you complete milestones.</p>
            <button className="mt-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold">
              Mark Phase 1 as Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
