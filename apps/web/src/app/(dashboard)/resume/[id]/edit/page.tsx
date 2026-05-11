'use client';

import { useState, useEffect, use } from 'react';
import { 
  Save, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Download, 
  Type, 
  Loader2,
  Layout,
  Trash2,
  GripVertical
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button, Input, Label } from '@portfolioai/ui';

interface ResumeSection {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'custom';
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
  const [exporting, setExporting] = useState(false);

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
    } catch (error: any) {
      toast.error('AI optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  const handleGetAtsScore = async () => {
    setOptimizing(true);
    try {
      const response = await api.get<any>(`/resumes/${id}/score`);
      if (response.success) {
        setResume(prev => prev ? { ...prev, atsScore: response.data } : null);
        toast.success('ATS Score updated!');
      }
    } catch (error: any) {
      toast.error('Failed to get ATS score');
    } finally {
      setOptimizing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Create a temporary hidden link to download the file directly from API endpoint
      // assuming API requires auth, we can't just use window.open
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/resumes/${id}/export/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // simple fallback
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume?.title || 'resume'}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Resume exported successfully!');
    } catch (error: any) {
      toast.error('Failed to export resume');
    } finally {
      setExporting(false);
    }
  };

  const addSection = (type: ResumeSection['type'], title: string) => {
    if (!resume) return;
    const newSection: ResumeSection = {
      id: `sec_${Date.now()}`,
      type,
      title,
      content: type === 'experience' || type === 'education' ? { items: [] } : type === 'skills' ? { skills: [] } : {}
    };
    setResume({ ...resume, sections: [...resume.sections, newSection] });
  };

  const removeSection = (sectionId: string) => {
    if (!resume) return;
    setResume({ ...resume, sections: resume.sections.filter(s => s.id !== sectionId) });
  };

  const updateSection = (sectionId: string, content: any) => {
    if (!resume) return;
    setResume({
      ...resume,
      sections: resume.sections.map(s => s.id === sectionId ? { ...s, content } : s)
    });
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Editor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 border-r border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Target Settings & ATS */}
            <div className="grid gap-6 md:grid-cols-2">
              <section className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-bold uppercase tracking-wider text-xs">AI Optimization Target</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Job Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      value={resume.targetRole || ''}
                      onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Description</label>
                    <textarea
                      rows={3}
                      placeholder="Paste the job description here..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      value={resume.jobDescription || ''}
                      onChange={(e) => setResume({ ...resume, jobDescription: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGetAtsScore}
                      disabled={optimizing}
                      className="flex-1 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
                    >
                      Score Resume
                    </button>
                    <button
                      onClick={handleOptimize}
                      disabled={optimizing}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Auto-Optimize
                    </button>
                  </div>
                </div>
              </section>

              {/* ATS Score Display */}
              <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500 mb-4">ATS Compatibility</h3>
                {resume.atsScore ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-100 dark:text-gray-800" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * resume.atsScore.score) / 100} className="text-blue-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{resume.atsScore.score}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {resume.atsScore.score >= 80 ? 'Excellent Match' : resume.atsScore.score >= 60 ? 'Good Match' : 'Needs Improvement'}
                        </p>
                        <p className="text-xs text-gray-500">Based on target role & description</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Suggestions:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
                        {(resume.atsScore.suggestions || []).slice(0, 3).map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center text-gray-400">
                    <Sparkles className="h-6 w-6 mb-2 opacity-20" />
                    <p className="text-xs">Click "Score Resume" to analyze<br/>against the job description</p>
                  </div>
                )}
              </section>
            </div>

            {/* Resume Content Sections */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Resume Content</h3>
                <div className="flex gap-2">
                  <select 
                    className="text-sm border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    onChange={(e) => {
                      if (e.target.value) {
                        addSection(e.target.value as any, e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">+ Add Section</option>
                    {!resume.sections.find(s => s.type === 'personal') && <option value="personal">Personal Info</option>}
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                    <option value="skills">Skills</option>
                  </select>
                </div>
              </div>
              
              {resume.sections.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
                  <p className="text-gray-500">Your resume is empty. Start adding sections above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resume.sections.map((section) => (
                    <div key={section.id} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">{section.title}</h4>
                        <button onClick={() => removeSection(section.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {section.type === 'personal' && (
                        <div className="grid gap-3 md:grid-cols-2">
                          <Input placeholder="Full Name" value={section.content.name || ''} onChange={e => updateSection(section.id, { ...section.content, name: e.target.value })} />
                          <Input placeholder="Email" value={section.content.email || ''} onChange={e => updateSection(section.id, { ...section.content, email: e.target.value })} />
                          <Input placeholder="Phone" value={section.content.phone || ''} onChange={e => updateSection(section.id, { ...section.content, phone: e.target.value })} />
                          <Input placeholder="Location" value={section.content.location || ''} onChange={e => updateSection(section.id, { ...section.content, location: e.target.value })} />
                        </div>
                      )}

                      {section.type === 'experience' && (
                        <div className="space-y-4">
                          {(section.content.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg relative">
                              <div className="grid md:grid-cols-2 gap-2 mb-2">
                                <Input placeholder="Company" value={item.company || ''} onChange={e => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].company = e.target.value;
                                  updateSection(section.id, { ...section.content, items: newItems });
                                }} />
                                <Input placeholder="Role" value={item.role || ''} onChange={e => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].role = e.target.value;
                                  updateSection(section.id, { ...section.content, items: newItems });
                                }} />
                              </div>
                              <textarea 
                                className="w-full text-sm p-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                rows={2} 
                                placeholder="Description (bullet points recommended)"
                                value={item.description || ''}
                                onChange={e => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].description = e.target.value;
                                  updateSection(section.id, { ...section.content, items: newItems });
                                }}
                              />
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => {
                            updateSection(section.id, { ...section.content, items: [...(section.content.items || []), {}] });
                          }}>+ Add Experience Item</Button>
                        </div>
                      )}

                      {section.type === 'education' && (
                        <div className="space-y-4">
                          {(section.content.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                              <div className="grid md:grid-cols-2 gap-2">
                                <Input placeholder="School/University" value={item.school || ''} onChange={e => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].school = e.target.value;
                                  updateSection(section.id, { ...section.content, items: newItems });
                                }} />
                                <Input placeholder="Degree" value={item.degree || ''} onChange={e => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].degree = e.target.value;
                                  updateSection(section.id, { ...section.content, items: newItems });
                                }} />
                              </div>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => {
                            updateSection(section.id, { ...section.content, items: [...(section.content.items || []), {}] });
                          }}>+ Add Education Item</Button>
                        </div>
                      )}

                      {section.type === 'skills' && (
                        <div>
                          <Input 
                            placeholder="Add skills separated by commas (e.g. React, Python, SQL)" 
                            value={(section.content.skills || []).join(', ')}
                            onChange={e => updateSection(section.id, { ...section.content, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          />
                        </div>
                      )}
                    </div>
                  ))}
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

          <div className="aspect-[1/1.414] w-full bg-white shadow-2xl rounded-sm p-8 overflow-hidden text-[8px] text-gray-800 leading-tight">
            {/* Extremely basic HTML preview rendered locally just for visual feedback */}
            {resume.sections.find(s => s.type === 'personal') && (
              <div className="mb-4 text-center">
                <h1 className="text-sm font-bold">{resume.sections.find(s => s.type === 'personal')?.content.name || resume.title}</h1>
                <p>{resume.sections.find(s => s.type === 'personal')?.content.email} • {resume.sections.find(s => s.type === 'personal')?.content.phone}</p>
                <p>{resume.sections.find(s => s.type === 'personal')?.content.location}</p>
              </div>
            )}
            
            {resume.sections.map(section => {
              if (section.type === 'personal') return null;
              return (
                <div key={section.id} className="mb-4">
                  <h2 className="text-[10px] font-bold text-blue-800 border-b border-blue-800 mb-1 uppercase">{section.title}</h2>
                  
                  {section.type === 'experience' && (section.content.items || []).map((item: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between font-bold">
                        <span>{item.role}</span>
                        <span>{item.company}</span>
                      </div>
                      <p className="whitespace-pre-wrap mt-0.5">{item.description}</p>
                    </div>
                  ))}

                  {section.type === 'education' && (section.content.items || []).map((item: any, i: number) => (
                    <div key={i} className="mb-1 flex justify-between">
                      <span className="font-bold">{item.degree}</span>
                      <span>{item.school}</span>
                    </div>
                  ))}

                  {section.type === 'skills' && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(section.content.skills || []).map((skill: string, i: number) => (
                        <span key={i} className="px-1 py-0.5 bg-gray-100 rounded">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 italic">Preview is approximated. Export to see final PDF.</p>
        </div>
      </div>
    </div>
  );
}
