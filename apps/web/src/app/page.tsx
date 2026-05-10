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
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900">
              Portfolio<span className="text-blue-600">AI</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it works</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered career intelligence
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Build your career presence with{' '}
            <span className="gradient-text">AI precision</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
            Generate stunning portfolios, ATS-optimized resumes, and personalized career
            roadmaps — all powered by AI. Stand out to recruiters in minutes, not days.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 transition-all"
            >
              Start building for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              See how it works
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Free tier available</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> AI-powered</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Everything you need to accelerate your career</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful AI tools designed for modern professionals</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: 'AI Portfolio Builder', desc: 'Generate beautiful, responsive portfolios from your GitHub, LinkedIn, or resume in minutes.', color: 'bg-blue-50 text-blue-600' },
              { icon: FileText, title: 'ATS Resume Engine', desc: 'Score and optimize your resume for any job. Get AI-powered keyword and formatting suggestions.', color: 'bg-purple-50 text-purple-600' },
              { icon: TrendingUp, title: 'Skill Gap Analyzer', desc: 'Discover your strengths, identify gaps, and get personalized learning roadmaps.', color: 'bg-green-50 text-green-600' },
              { icon: Zap, title: 'AI Case Studies', desc: 'Transform your projects into compelling case studies that showcase your impact.', color: 'bg-amber-50 text-amber-600' },
              { icon: BarChart3, title: 'Career Analytics', desc: 'Track portfolio views, resume downloads, and recruiter engagement in real-time.', color: 'bg-cyan-50 text-cyan-600' },
              { icon: Shield, title: 'Professional Branding', desc: 'AI-optimized bios, LinkedIn summaries, and project descriptions that impress.', color: 'bg-rose-50 text-rose-600' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Build your portfolio in 3 steps</h2>
            <p className="mt-4 text-lg text-gray-600">From zero to published in under 5 minutes</p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: '01', title: 'Connect your data', desc: 'Link your GitHub, LinkedIn, or upload your resume. Our AI extracts everything it needs.' },
              { step: '02', title: 'AI generates your portfolio', desc: 'Choose a template and let AI craft your bio, case studies, skill profile, and project descriptions.' },
              { step: '03', title: 'Publish & share', desc: 'Get a custom URL, track analytics, and start getting noticed by recruiters instantly.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Import from anywhere</h2>
          <p className="mt-4 text-lg text-gray-600">Connect your favorite platforms and let AI do the rest</p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: Github, name: 'GitHub' },
              { icon: Linkedin, name: 'LinkedIn' },
              { name: 'Behance' },
              { name: 'Dribbble' },
              { name: 'Medium' },
              { name: 'Kaggle' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
              >
                {integration.icon ? (
                  <integration.icon className="h-5 w-5 text-gray-700" />
                ) : (
                  <div className="h-5 w-5 rounded bg-gray-200" />
                )}
                <span className="text-sm font-medium text-gray-700">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-12 py-16 text-white shadow-2xl shadow-blue-600/20">
            <h2 className="text-3xl font-bold md:text-4xl">Ready to build your AI portfolio?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of professionals who use PortfolioAI to stand out.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-medium text-blue-700 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Portfolio<span className="text-blue-600">AI</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <Link href="/pricing" className="hover:text-gray-700">Pricing</Link>
              <Link href="#" className="hover:text-gray-700">Privacy</Link>
              <Link href="#" className="hover:text-gray-700">Terms</Link>
              <Link href="#" className="hover:text-gray-700">Contact</Link>
            </div>
            <p className="text-xs text-gray-400">© 2026 PortfolioAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
