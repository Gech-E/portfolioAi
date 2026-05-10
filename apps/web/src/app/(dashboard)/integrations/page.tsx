import { Github, Linkedin, Check, ExternalLink } from 'lucide-react';

const integrations = [
  { name: 'GitHub', desc: 'Import repos, languages, and contributions', icon: Github, connected: true, username: 'alexjohnson' },
  { name: 'LinkedIn', desc: 'Import experience, education, and skills', icon: Linkedin, connected: true, username: 'alex-johnson' },
  { name: 'Behance', desc: 'Import design projects and showcases', connected: false },
  { name: 'Dribbble', desc: 'Import design shots and portfolios', connected: false },
  { name: 'Medium', desc: 'Import published articles and stories', connected: false },
  { name: 'Kaggle', desc: 'Import notebooks and competitions', connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
        <p className="mt-1 text-sm text-gray-500">Connect your accounts to enrich your portfolio</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center gap-4 rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
              {i.icon ? <i.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <div className="h-5 w-5 rounded bg-gray-300" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{i.name}</p>
              <p className="text-xs text-gray-500">{i.desc}</p>
            </div>
            {i.connected ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"><Check className="h-3 w-3" />Connected</span>
              </div>
            ) : (
              <button className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
