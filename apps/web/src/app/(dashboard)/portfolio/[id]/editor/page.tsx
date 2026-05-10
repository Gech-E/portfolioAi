'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Sparkles, 
  Layout, 
  Loader2, 
  CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@portfolioai/ui';
import { toast } from 'sonner';

// Components
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorMain } from '@/components/editor/EditorMain';
import { EditorPreview } from '@/components/editor/EditorPreview';

export default function PortfolioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const [activeSection, setActiveSection] = useState('basics');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [localData, setLocalData] = useState<any>(null);

  // Fetch portfolio data
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => api.get<any>(`/portfolios/${id}`).then(res => res.data),
  });

  // Sync local data with fetched data
  useEffect(() => {
    if (portfolio && !localData) {
      setLocalData(portfolio);
    }
  }, [portfolio, localData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => api.patch(`/portfolios/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
      toast.success('Changes saved successfully');
    },
    onError: () => {
      toast.error('Failed to save changes');
    }
  });

  const handleSave = () => {
    if (localData) {
      saveMutation.mutate(localData);
    }
  };

  const handleUpdate = (updates: any) => {
    setLocalData((prev: any) => ({
      ...prev,
      ...updates,
    }));
  };

  if (isLoading || !localData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Editor Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/portfolio')}
            className="text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
          <div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
              {localData.title || 'Untitled Portfolio'}
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> Saved
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="hidden md:flex"
          >
            {isPreviewOpen ? <Layout className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {isPreviewOpen ? 'Edit Mode' : 'Live Preview'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => toast.info('AI generation coming in the next step!')}
          >
            <Sparkles className="mr-2 h-4 w-4" /> AI Generate
          </Button>

          <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isPreviewOpen && (
          <EditorSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        )}

        {/* Main Editor Area */}
        <div className={`flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-6 transition-all ${isPreviewOpen ? 'hidden md:block' : 'block'}`}>
          <div className="mx-auto max-w-3xl">
            {isPreviewOpen ? (
              <EditorPreview data={localData} />
            ) : (
              <EditorMain 
                section={activeSection} 
                data={localData} 
                onUpdate={handleUpdate} 
              />
            )}
          </div>
        </div>

        {/* Floating Preview for Desktop (Split View) */}
        {!isPreviewOpen && (
          <div className="hidden w-1/3 border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:block overflow-y-auto p-6">
            <div className="sticky top-0 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live Preview</h3>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-gray-400">Active</span>
              </div>
            </div>
            <EditorPreview data={localData} isCondensed />
          </div>
        )}
      </div>
    </div>
  );
}
