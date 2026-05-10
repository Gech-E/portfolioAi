'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, LayoutTemplate, Link as LinkIcon, Plus } from 'lucide-react';
import { api } from '@/lib/api';

const createSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
});

type CreateInput = z.infer<typeof createSchema>;

export default function NewPortfolioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateInput>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
    },
  });

  const slugValue = watch('slug');

  const onSubmit = async (data: CreateInput) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ id: string }>('/portfolios', data);
      if (response.success) {
        toast.success('Portfolio created successfully');
        router.push(`/portfolio/${response.data.id}/editor`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create new portfolio</h2>
        <p className="mt-1.5 text-sm text-gray-500">Set up the foundation for your new professional showcase</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Form */}
        <div className="rounded-xl border border-gray-200/60 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Portfolio Title
              </label>
              <input
                id="title"
                {...register('title')}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="e.g. Alex Johnson — Full Stack Developer"
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL Slug
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                  portfolioai.com/p/
                </span>
                <input
                  id="slug"
                  {...register('slug')}
                  className="flex h-10 w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="alex-johnson"
                />
              </div>
              {errors.slug && <p className="mt-1.5 text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="A brief description of what this portfolio showcases..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isLoading ? 'Creating...' : 'Create Portfolio'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
            <h3 className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
              <LayoutTemplate className="h-4 w-4 text-blue-600" />
              What happens next?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-blue-700 dark:text-blue-200">
              After creating the foundation, you'll be taken to the Portfolio Editor where you can:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-blue-700 dark:text-blue-200">
              <li className="flex items-start gap-1.5"><span className="text-blue-400">•</span> Choose a template</li>
              <li className="flex items-start gap-1.5"><span className="text-blue-400">•</span> Import data from GitHub/LinkedIn</li>
              <li className="flex items-start gap-1.5"><span className="text-blue-400">•</span> Let AI generate case studies</li>
            </ul>
          </div>

          {slugValue && (
            <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                Your future URL
              </h3>
              <p className="mt-2 break-all text-xs text-blue-600">
                portfolioai.com/p/{slugValue.toLowerCase().replace(/[^a-z0-9-]/g, '')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
