'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard, Globe, FileText, Sparkles,
  BarChart3, Route, Plug, Settings,
  Briefcase, Search, Plus, Bell, LogOut,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const mainNav = [
  { label: 'Workspace', items: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Portfolio', href: '/portfolio', icon: Globe },
    { name: 'Resume Builder', href: '/resume', icon: FileText },
    { name: 'AI Tools', href: '/ai-tools', icon: Sparkles },
  ]},
  { label: 'Growth', items: [
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Career Roadmap', href: '/career-roadmap', icon: Route },
    { name: 'Integrations', href: '/integrations', icon: Plug },
  ]},
];

const bottomNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, setLoading } = useAuthStore();

  // On mount, validate that we actually have auth state.
  // If not (e.g. localStorage was cleared or corrupted), redirect to login.
  useEffect(() => {
    const stored = localStorage.getItem('portfolioai-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.state?.accessToken && parsed.state?.isAuthenticated) {
          // Valid persisted session — mark loading as done
          setLoading(false);
          return;
        }
      } catch {
        // corrupt data
      }
    }

    // No valid session found — force redirect to login
    logout();
    router.replace('/login');
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore errors during logout — we clear client state regardless
    }
    logout();
    router.replace('/login');
  };

  // If no user data yet (loading or not authenticated), show minimal loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="flex w-[220px] flex-shrink-0 flex-col border-r border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-medium text-gray-900 dark:text-white">
            Portfolio<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {mainNav.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.label}
              </p>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                      isActive
                        ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <item.icon className="h-[17px] w-[17px]" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Separator + bottom nav */}
        <div className="border-t border-gray-100 px-3 py-2 dark:border-gray-800">
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                  isActive
                    ? 'bg-gray-50 font-medium text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-[17px] w-[17px]" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User chip */}
        <div className="border-t border-gray-100 p-4 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white uppercase">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 truncate uppercase tracking-tighter font-bold">{user?.role} PLAN</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b border-gray-200/60 bg-white px-7 dark:border-gray-800 dark:bg-gray-900">
          <h1 className="flex-1 text-[15px] font-medium text-gray-900 dark:text-white">
            {mainNav.flatMap((s) => s.items).find((i) => pathname === i.href)?.name ||
              bottomNav.find((i) => pathname.startsWith(i.href))?.name ||
              'Dashboard'}
          </h1>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200/60 bg-gray-50 px-3 py-[7px] dark:border-gray-700 dark:bg-gray-800">
            <Search className="h-[15px] w-[15px] text-gray-400" />
            <input
              type="text"
              placeholder="Search portfolios, skills…"
              className="w-48 border-none bg-transparent text-[13px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
          <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>
          <Link
            href="/portfolio/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-[7px] text-[13px] font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-[15px] w-[15px]" />
            New portfolio
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-7">{children}</main>
      </div>
    </div>
  );
}
