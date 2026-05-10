'use client';

import React from 'react';
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Layout, 
  Settings,
  Star,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'basics', label: 'Basic Info', icon: User },
  { id: 'about', label: 'About Me', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'skills', label: 'Skills', icon: Star },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'appearance', label: 'Appearance', icon: Layout },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function EditorSidebar({ activeSection, onSectionChange }: EditorSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 flex flex-col">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">Sections</h2>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400")} />
                {section.label}
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto border-t border-gray-100 p-4 dark:border-gray-800">
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 dark:from-indigo-950/40 dark:to-blue-950/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pro Tip</p>
          <p className="mt-1 text-xs text-indigo-900 dark:text-indigo-200">
            Use the <strong>AI Generate</strong> button to instantly write professional bios and descriptions.
          </p>
        </div>
      </div>
    </aside>
  );
}
