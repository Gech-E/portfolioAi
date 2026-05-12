import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  FileText,
  BarChart3,
  ArrowRight,
  Check,
  Github,
  Linkedin,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '../components/animations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/20">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white">
              Portfolio<span className="text-brand-600 dark:text-brand-400">AI</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">How it works</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 px-4 py-1.5 text-sm text-brand-700 dark:text-brand-300 mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-medium">PortfolioAI 2.0 is here</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-50" />
            </div>
          </FadeIn>
          
          <SlideUp delay={0.2}>
            <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
              Build your career presence with{' '}
              <span className="gradient-text">AI precision</span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-balance">
              Generate stunning portfolios, ATS-optimized resumes, and personalized career
              roadmaps — all powered by AI. Stand out to recruiters in minutes, not days.
            </p>
          </SlideUp>

          <SlideUp delay={0.4}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-8 py-3.5 text-base font-medium text-white dark:text-gray-900 shadow-xl shadow-gray-900/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start building for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm px-8 py-3.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                See how it works
              </Link>
            </div>
          </SlideUp>

          <FadeIn delay={0.5}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-500" /> Free tier available</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-500" /> AI-powered</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Dashboard Preview / Mockup Mock */}
      <section className="relative z-20 -mt-10 md:-mt-20 px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <SlideUp delay={0.6}>
            <div className="glass-card overflow-hidden rounded-2xl border border-white/40 dark:border-white/10 p-2 shadow-2xl">
              <div className="aspect-[16/9] w-full rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative">
                {/* Mock UI Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 dark:from-brand-500/10 dark:to-purple-500/10" />
                <div className="h-full w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-black/40 p-6 hidden md:block">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-md mb-8" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-6 w-full bg-gray-100 dark:bg-white/5 rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-8 h-full flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-lg" />
                    <div className="h-10 w-10 bg-brand-500 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm" />
                    ))}
                  </div>
                  <div className="flex-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6">
          <SlideUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Everything you need to accelerate your career</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Powerful AI tools designed for modern professionals</p>
            </div>
          </SlideUp>
          
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: 'AI Portfolio Builder', desc: 'Generate beautiful, responsive portfolios from your GitHub, LinkedIn, or resume in minutes.', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
              { icon: FileText, title: 'ATS Resume Engine', desc: 'Score and optimize your resume for any job. Get AI-powered keyword and formatting suggestions.', color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' },
              { icon: TrendingUp, title: 'Skill Gap Analyzer', desc: 'Discover your strengths, identify gaps, and get personalized learning roadmaps.', color: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400' },
              { icon: Zap, title: 'AI Case Studies', desc: 'Transform your projects into compelling case studies that showcase your impact.', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
              { icon: BarChart3, title: 'Career Analytics', desc: 'Track portfolio views, resume downloads, and recruiter engagement in real-time.', color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
              { icon: Shield, title: 'Professional Branding', desc: 'AI-optimized bios, LinkedIn summaries, and project descriptions that impress.', color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group glass-card h-full p-8">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-6 transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/50 dark:bg-brand-900/10 -skew-y-3 origin-top-left -z-10" />
        <div className="mx-auto max-w-7xl px-6">
          <SlideUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Build your portfolio in 3 steps</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">From zero to published in under 5 minutes</p>
            </div>
          </SlideUp>
          
          <div className="grid gap-12 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 dark:from-brand-800 dark:via-brand-500 dark:to-brand-800" />
            {[
              { step: '01', title: 'Connect your data', desc: 'Link your GitHub, LinkedIn, or upload your resume. Our AI extracts everything it needs.' },
              { step: '02', title: 'AI generates your portfolio', desc: 'Choose a template and let AI craft your bio, case studies, skill profile, and project descriptions.' },
              { step: '03', title: 'Publish & share', desc: 'Get a custom URL, track analytics, and start getting noticed by recruiters instantly.' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.2}>
                <div className="text-center relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border-2 border-brand-500 shadow-xl shadow-brand-500/20 text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {item.step}
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-white dark:bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <SlideUp>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Import from anywhere</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Connect your favorite platforms and let AI do the rest</p>
          </SlideUp>
          
          <StaggerContainer className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Github, name: 'GitHub' },
              { icon: Linkedin, name: 'LinkedIn' },
              { name: 'Behance' },
              { name: 'Dribbble' },
              { name: 'Medium' },
              { name: 'Kaggle' },
            ].map((integration) => (
              <StaggerItem key={integration.name}>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-6 py-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  {integration.icon ? (
                    <integration.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <div className="h-5 w-5 rounded bg-gray-300 dark:bg-white/20" />
                  )}
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{integration.name}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <SlideUp>
            <div className="rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-white/10 p-12 md:p-20 text-white shadow-2xl shadow-brand-900/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              
              <h2 className="text-3xl font-bold md:text-5xl tracking-tight relative z-10">Ready to build your AI portfolio?</h2>
              <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto relative z-10">
                Join thousands of professionals who use PortfolioAI to stand out. Let the AI handle the formatting so you can focus on your career.
              </p>
              <div className="mt-10 relative z-10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-xl hover:scale-105 transition-transform"
                >
                  Get started for free <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/10 py-12 bg-gray-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Portfolio<span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600">© 2026 PortfolioAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
