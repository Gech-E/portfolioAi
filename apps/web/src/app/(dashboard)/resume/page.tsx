import { FileText, Plus } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="animate-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Resume Builder</h2>
          <p className="mt-1 text-sm text-gray-500">Create ATS-optimized resumes for any role</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> New Resume
        </button>
      </div>
      <div className="rounded-xl border border-gray-200/60 bg-white p-8 text-center dark:border-gray-700/60 dark:bg-gray-900">
        <FileText className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Create your first resume</h3>
        <p className="mt-2 text-sm text-gray-500">Upload an existing resume or let AI generate one from your profile</p>
        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Get Started</button>
      </div>
    </div>
  );
}
