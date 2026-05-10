'use client';

import React from 'react';
import { 
  MapPin, 
  Github, 
  Linkedin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@portfolioai/ui';

interface EditorPreviewProps {
  data: any;
  isCondensed?: boolean;
}

export function EditorPreview({ data, isCondensed = false }: EditorPreviewProps) {
  // Determine template style
  const isMinimal = data.template === 'minimal';
  
  return (
    <div className={cn(
      "font-sans text-gray-900 dark:text-gray-100",
      isCondensed ? "scale-[0.8] origin-top transform-gpu" : ""
    )}>
      {/* Hero / Header */}
      <section className={cn(
        "py-8 text-center",
        isMinimal ? "border-b border-gray-100 dark:border-gray-800" : "bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-gray-950"
      )}>
        <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl mb-4">
          {data.title?.[0]?.toUpperCase() || 'P'}
        </div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {data.title || 'Untitled Portfolio'}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Professional Portfolio • {data.template || 'Modern'}
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-3">
          <Badge variant="outline" className="text-[10px]">
            <MapPin className="mr-1 h-3 w-3" /> Remote
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            <Linkedin className="mr-1 h-3 w-3" /> LinkedIn
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            <Github className="mr-1 h-3 w-3" /> GitHub
          </Badge>
        </div>
      </section>

      {/* About Section */}
      {data.bio && (
        <section className="py-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 text-center">About</h2>
          <div className="mx-auto max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-center whitespace-pre-wrap">
            {data.bio}
          </div>
        </section>
      )}

      {/* Skills Section (Mocked for now) */}
      <section className="py-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-6 text-center">Expertise</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'AI/ML'].map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-400">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Experience (Placeholder) */}
      <section className="py-8 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8 text-center">Experience</h2>
        <div className="space-y-6 max-w-md mx-auto">
          {[1, 2].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">Senior Software Engineer</h4>
                <p className="text-xs text-gray-500">Tech Solutions Inc. • 2021 — Present</p>
                <p className="mt-2 text-xs text-gray-400 leading-normal">
                  Led the development of a cloud-based platform serving 1M+ users. Reduced latency by 40%.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center border-t border-gray-50 dark:border-gray-900">
        <p className="text-[10px] text-gray-400">
          Generated with PortfolioAI
        </p>
      </footer>
    </div>
  );
}
