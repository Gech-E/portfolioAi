import { Route, Target, BookOpen, Award } from 'lucide-react';

export default function CareerRoadmapPage() {
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Career Roadmap</h2>
        <p className="mt-1 text-sm text-gray-500">AI-powered career path and skill development plan</p>
      </div>
      <div className="rounded-xl border border-gray-200/60 bg-white p-8 text-center dark:border-gray-700/60 dark:bg-gray-900">
        <Route className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Generate your career roadmap</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Tell us your current role and target position, and AI will create a personalized development plan with milestones and resources.</p>
        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Generate Roadmap (4 credits)</button>
      </div>
    </div>
  );
}
