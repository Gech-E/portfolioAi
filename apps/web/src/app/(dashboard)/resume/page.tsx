'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Search, MoreVertical, Download, ExternalLink, Clock, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface Resume {
  id: string;
  title: string;
  status: string;
  targetRole: string | null;
  updatedAt: string;
  atsScore: any | null;
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get<Resume[]>('/resumes');
      setResumes(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await api.post<Resume>('/resumes', {
        title: 'Untitled Resume',
        sections: [],
      });
      toast.success('Resume created!');
      setResumes([response.data, ...resumes]);
      // Redirect to editor
      window.location.href = `/resume/${response.data.id}/edit`;
    } catch (error: any) {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch (error: any) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumes</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and optimize your AI-powered resumes</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create New Resume
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search resumes..."
          className="w-full rounded-xl border border-gray-200/60 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700/60 dark:bg-gray-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No resumes yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Start by creating a resume and let our AI optimize it for your dream job.</p>
          <button
            onClick={handleCreate}
            className="mt-6 text-blue-600 font-medium hover:underline"
          >
            Create your first resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <motion.div
              layout
              key={resume.id}
              className="group relative rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-700/60 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <button 
                  onClick={() => handleDelete(resume.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Link href={`/resume/${resume.id}/edit`}>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {resume.title}
                </h4>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {resume.targetRole || 'No target role set'}
              </p>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>
                {resume.atsScore ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                    ATS: {resume.atsScore.score || 0}%
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">No AI score</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
