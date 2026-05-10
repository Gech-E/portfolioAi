import {
  Eye, Download, Sparkles, UserCheck, TrendingUp,
  Code, Palette, Bot, PenLine,
  UserCircle, FileText, ClipboardList, Github, Linkedin, ArrowRight,
  Globe, Check,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="animate-in space-y-7">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Portfolio views', value: '3,842', change: '+18% this month', trend: 'up', icon: Eye },
          { label: 'Resume downloads', value: '124', change: '+7 this week', trend: 'up', icon: Download },
          { label: 'AI credits left', value: '38', change: 'of 50/month used', trend: 'flat', icon: Sparkles },
          { label: 'Employability score', value: '74', change: '+6 pts since last month', trend: 'up', icon: UserCheck },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900"
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <stat.icon className="h-3.5 w-3.5" />
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-medium text-gray-900 dark:text-white">{stat.value}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-xs ${
              stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}>
              {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-5">
          {/* My Portfolios */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">My portfolios</h3>
              <div className="flex gap-0.5 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <button className="rounded-md bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">All</button>
                <button className="rounded-md px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">Live</button>
                <button className="rounded-md px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">Drafts</button>
              </div>
            </div>
            {[
              { name: 'Full-Stack Developer Portfolio', url: 'alexjohnson.portfolioai.com', status: 'Live', views: '2,104', icon: Code, iconColor: 'text-purple-700', iconBg: 'bg-purple-50' },
              { name: 'UX & Design Showcase', url: 'alex-design.portfolioai.com', status: 'Draft', views: '—', icon: Palette, iconColor: 'text-sky-700', iconBg: 'bg-sky-50' },
              { name: 'AI & ML Projects', url: 'alex-ml.portfolioai.com', status: 'Live', views: '1,738', icon: Bot, iconColor: 'text-green-700', iconBg: 'bg-green-50' },
              { name: 'Technical Writing Portfolio', url: 'Not published yet', status: 'AI generating…', views: '—', icon: PenLine, iconColor: 'text-amber-700', iconBg: 'bg-amber-50' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3 border-b border-gray-100 py-2.5 last:border-b-0 last:pb-0 dark:border-gray-800">
                <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg ${p.iconBg}`}>
                  <p.icon className={`h-[17px] w-[17px] ${p.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.url}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  p.status === 'Live' ? 'bg-green-50 text-green-700' :
                  p.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                  'bg-purple-50 text-purple-700'
                }`}>{p.status}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                  {p.views !== '—' && <Eye className="h-3 w-3" />} {p.views}
                </span>
              </div>
            ))}
          </div>

          {/* Skill Profile */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Skill profile</h3>
              <span className="text-xs text-gray-400">Based on GitHub + LinkedIn</span>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {[
                { skill: 'React / Next.js', level: 92 },
                { skill: 'Python', level: 78 },
                { skill: 'Node.js', level: 85 },
                { skill: 'TypeScript', level: 80 },
                { skill: 'PostgreSQL', level: 65, warn: true },
                { skill: 'Docker / K8s', level: 55, warn: true },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{s.skill}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{s.level}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${s.warn ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-[13px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Run AI skill gap analysis ↗
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* AI Tools */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">AI tools</h3>
            <div className="space-y-2.5">
              {[
                { title: 'Generate bio', desc: 'Rewrite your About section', icon: UserCircle, iconBg: 'bg-purple-50', iconColor: 'text-purple-700' },
                { title: 'Optimize resume', desc: 'Target a specific job role', icon: FileText, iconBg: 'bg-sky-50', iconColor: 'text-sky-700' },
                { title: 'Write case study', desc: 'From your GitHub projects', icon: ClipboardList, iconBg: 'bg-green-50', iconColor: 'text-green-700' },
                { title: 'Generate README', desc: 'Auto-document your repos', icon: Github, iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
                { title: 'Improve LinkedIn', desc: 'Recruiter-optimized summary', icon: Linkedin, iconBg: 'bg-red-50', iconColor: 'text-red-700' },
              ].map((tool) => (
                <button
                  key={tool.title}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tool.iconBg}`}>
                    <tool.icon className={`h-[17px] w-[17px] ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white">{tool.title}</p>
                    <p className="text-xs text-gray-400">{tool.desc}</p>
                  </div>
                  <ArrowRight className="h-[15px] w-[15px] text-gray-300" />
                </button>
              ))}
            </div>
          </div>

          {/* ATS Score */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Resume ATS score</h3>
            <div className="flex gap-0.5 rounded-lg bg-gray-100 p-1 mb-4 dark:bg-gray-800">
              <button className="rounded-md bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">SE — Senior Role</button>
              <button className="rounded-md px-3 py-1 text-xs text-gray-500">PM Role</button>
            </div>
            {/* Score ring */}
            <div className="flex flex-col items-center py-4">
              <div className="relative" style={{ width: 88, height: 88 }}>
                <svg width={88} height={88} viewBox="0 0 88 88" fill="none">
                  <circle cx="44" cy="44" r="36" stroke="#f3f4f6" strokeWidth="8" className="dark:stroke-gray-800" />
                  <circle cx="44" cy="44" r="36" stroke="#2563EB" strokeWidth="8" strokeDasharray="226" strokeDashoffset="59" strokeLinecap="round" transform="rotate(-90 44 44)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-medium text-gray-900 dark:text-white">74</span>
                  <span className="text-[10px] text-gray-400">/ 100</span>
                </div>
              </div>
              <p className="mt-2.5 text-center text-[13px] text-gray-500">Good — minor improvements will push you to 85+</p>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"><Check className="h-2.5 w-2.5" /> Keywords matched</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"><Check className="h-2.5 w-2.5" /> Formatting</span>
              <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-700">Weak action verbs</span>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">Missing: AWS cert</span>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">Missing: system design</span>
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-[13px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Auto-fix with AI ↗
            </button>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Recent activity</h3>
            <div className="space-y-0">
              {[
                { text: 'AI generated your ML portfolio bio', time: '2 hours ago', icon: Sparkles, iconBg: 'bg-purple-50', iconColor: 'text-purple-700' },
                { text: 'Full-Stack portfolio published', time: 'Yesterday', icon: Globe, iconBg: 'bg-green-50', iconColor: 'text-green-700' },
                { text: '12 GitHub repos imported', time: '2 days ago', icon: Github, iconBg: 'bg-sky-50', iconColor: 'text-sky-700' },
                { text: 'Resume optimized for SE role', time: '3 days ago', icon: FileText, iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 border-b border-gray-100 py-2.5 last:border-b-0 dark:border-gray-800">
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                    <item.icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-900 dark:text-white">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
