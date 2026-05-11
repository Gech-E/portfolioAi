'use client';

import React from 'react';
import { 
  MapPin, 
  Github, 
  Linkedin,
  ExternalLink,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@portfolioai/ui';

interface EditorPreviewProps {
  data: any;
  isCondensed?: boolean;
}

export function EditorPreview({ data, isCondensed = false }: EditorPreviewProps) {
  const isMinimal = data.template === 'minimal';
  const isCreative = data.template === 'creative';
  
  const themeColor = data.theme?.color || 'blue';
  
  // A helper function to apply the chosen theme color
  const getColorClass = (type: 'text' | 'bg' | 'border') => {
    const map: any = {
      blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-600', border: 'border-blue-600' },
      purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-600', border: 'border-purple-600' },
      emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600', border: 'border-emerald-600' },
      rose: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-600', border: 'border-rose-600' },
      slate: { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-600', border: 'border-slate-600' }
    };
    return map[themeColor]?.[type] || map['blue'][type];
  };

  return (
    <div className={cn(
      "font-sans text-gray-900 dark:text-gray-100 transition-colors",
      isCondensed ? "scale-[0.8] origin-top transform-gpu" : ""
    )}>
      {/* Hero / Header */}
      <section className={cn(
        "py-12 text-center relative overflow-hidden",
        isMinimal ? "border-b border-gray-100 dark:border-gray-800" : 
        isCreative ? "bg-gray-900 text-white" : 
        "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
      )}>
        {isCreative && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        )}
        <div className="relative z-10">
          <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center font-bold text-3xl mb-6 shadow-xl ${
            isCreative ? 'bg-white text-gray-900' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
          }`}>
            {data.title?.[0]?.toUpperCase() || 'P'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl mb-4">
            {data.title || 'Untitled Portfolio'}
          </h1>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data.location && (
              <Badge variant="outline" className={isCreative ? "border-gray-700" : ""}>
                <MapPin className="mr-1 h-3 w-3" /> {data.location}
              </Badge>
            )}
            {data.website && (
              <Badge variant="outline" className={isCreative ? "border-gray-700" : ""}>
                <ExternalLink className="mr-1 h-3 w-3" /> {data.website.replace(/^https?:\/\//, '')}
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        {/* About Section */}
        {data.bio && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-6", getColorClass('text'))}>About</h2>
            <div className="text-base leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {data.bio}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-6", getColorClass('text'))}>Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string) => (
                <span key={skill} className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border",
                  isCreative ? "border-gray-200 dark:border-gray-800" : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-700 dark:text-gray-300"
                )}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-8", getColorClass('text'))}>Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-800", getColorClass('text'))}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    {i !== data.experience.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-800 mt-4" />}
                  </div>
                  <div className="pb-8">
                    <h4 className="text-lg font-bold">{exp.role || 'Role'}</h4>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {exp.company || 'Company'} • {exp.startDate || 'Start'} — {exp.endDate || 'End'}
                    </p>
                    {exp.description && (
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-8", getColorClass('text'))}>Selected Work</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.projects.map((proj: any, i: number) => (
                <div key={i} className={cn(
                  "rounded-xl p-6 border transition-all hover:shadow-md",
                  isCreative ? "bg-gray-50 dark:bg-gray-900 border-transparent" : "border-gray-200 dark:border-gray-800"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold">{proj.name || 'Project Name'}</h4>
                    <div className="flex gap-2">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 whitespace-pre-wrap">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {proj.technologies.map((tech: string) => (
                        <span key={tech} className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-8", getColorClass('text'))}>Education</h2>
            <div className="space-y-6">
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className={cn("h-10 w-10 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0", getColorClass('text'))}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{edu.degree || 'Degree'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {edu.school || 'School'} • {edu.startDate || 'Start'} — {edu.endDate || 'End'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center border-t border-gray-100 dark:border-gray-900">
        <p className="text-sm text-gray-400">
          Generated with PortfolioAI
        </p>
      </footer>
    </div>
  );
}
