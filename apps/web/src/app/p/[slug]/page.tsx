import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Globe, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Badge } from '@portfolioai/ui';

// This is a Server Component
async function getPortfolio(slug: string) {
  const API_URL = process.env.API_URL || 'http://localhost:4005';
  
  try {
    const res = await fetch(`${API_URL}/p/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const portfolio = await getPortfolio(params.slug);
  if (!portfolio) return { title: 'Portfolio Not Found' };

  return {
    title: `${portfolio.title} | PortfolioAI`,
    description: portfolio.description || `Professional portfolio of ${portfolio.user.firstName} ${portfolio.user.lastName}`,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      type: 'website',
    },
  };
}

export default async function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const portfolio = await getPortfolio(params.slug);

  if (!portfolio) {
    notFound();
  }

  const { user } = portfolio;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header / Hero */}
      <header className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.firstName} className="h-24 w-24 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-xl dark:border-gray-800" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-8">
              {portfolio.title}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                <MapPin className="mr-2 h-4 w-4" /> Available for Hire
              </Badge>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto grid gap-20">
          {/* About */}
          <section id="about">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-6">About Me</h2>
            <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {portfolio.description || portfolio.bio || "No bio provided yet."}
            </div>
          </section>

          {/* Experience Placeholder */}
          <section id="experience">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-10">Experience</h2>
            <div className="space-y-12">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-12">
                  <div className="md:w-1/4 text-sm text-gray-500 font-medium">
                    2021 — PRESENT
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Senior Product Designer</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Global Tech Solutions</p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Leading the design of the core product suite, focusing on scalability and user engagement. 
                      Collaborated with engineering teams to implement a new design system.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-20 text-center border-t border-gray-100 dark:border-gray-900">
            <h2 className="text-3xl font-bold mb-6">Let's work together</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
              I'm currently looking for new opportunities. Feel free to reach out if you'd like to collaborate.
            </p>
            <a href={`mailto:${user.email}`} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
              Get in Touch
            </a>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-50 dark:border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            Made with <Globe className="h-4 w-4 text-blue-500" /> PortfolioAI
          </p>
        </div>
      </footer>
    </div>
  );
}
