import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PortfolioAI — AI-Powered Portfolio Builder',
    template: '%s | PortfolioAI',
  },
  description:
    'Build stunning portfolios, ATS-optimized resumes, and career roadmaps with AI. Stand out to recruiters with professional branding powered by artificial intelligence.',
  keywords: [
    'portfolio builder',
    'AI resume',
    'ATS optimization',
    'career intelligence',
    'professional branding',
  ],
  authors: [{ name: 'PortfolioAI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PortfolioAI',
    title: 'PortfolioAI — AI-Powered Portfolio Builder',
    description:
      'Build stunning portfolios and ATS-optimized resumes with AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PortfolioAI',
    description: 'AI-Powered Portfolio Builder & Career Intelligence',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
