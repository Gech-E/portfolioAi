export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">PortfolioAI</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Build your career<br />presence with AI
          </h1>
          <p className="mt-4 max-w-md text-lg text-blue-100/80">
            Generate stunning portfolios, ATS-optimized resumes, and career roadmaps in minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {['AI Portfolio Generation', 'ATS Resume Scoring', 'Career Intelligence'].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-blue-100/90">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-blue-200/60">© 2026 PortfolioAI</p>
      </div>
      {/* Right — Auth form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
