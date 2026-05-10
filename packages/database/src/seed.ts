import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const freePlan = await prisma.plan.upsert({
    where: { tier: 'FREE' },
    update: {},
    create: {
      name: 'Free',
      tier: 'FREE',
      description: 'Get started with basic portfolio features',
      priceMonthly: 0,
      priceYearly: 0,
      aiCreditsPerMonth: 10,
      maxPortfolios: 1,
      maxResumes: 2,
      customDomain: false,
      analyticsAccess: false,
      prioritySupport: false,
      features: JSON.parse(JSON.stringify([
        { name: '1 Portfolio', included: true },
        { name: '2 Resumes', included: true },
        { name: '10 AI Credits/mo', included: true },
        { name: 'Basic Templates', included: true },
        { name: 'Custom Domain', included: false },
        { name: 'Analytics', included: false },
      ])),
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { tier: 'PRO' },
    update: {},
    create: {
      name: 'Pro',
      tier: 'PRO',
      description: 'For professionals who want to stand out',
      priceMonthly: 1200,
      priceYearly: 9600,
      aiCreditsPerMonth: 50,
      maxPortfolios: 5,
      maxResumes: 10,
      customDomain: true,
      analyticsAccess: true,
      prioritySupport: false,
      features: JSON.parse(JSON.stringify([
        { name: '5 Portfolios', included: true },
        { name: '10 Resumes', included: true },
        { name: '50 AI Credits/mo', included: true },
        { name: 'Premium Templates', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Analytics', included: true },
      ])),
    },
  });

  const proPlusPlan = await prisma.plan.upsert({
    where: { tier: 'PRO_PLUS' },
    update: {},
    create: {
      name: 'Pro+',
      tier: 'PRO_PLUS',
      description: 'Unlimited everything for power users',
      priceMonthly: 2400,
      priceYearly: 19200,
      aiCreditsPerMonth: 200,
      maxPortfolios: -1,
      maxResumes: -1,
      customDomain: true,
      analyticsAccess: true,
      prioritySupport: true,
      features: JSON.parse(JSON.stringify([
        { name: 'Unlimited Portfolios', included: true },
        { name: 'Unlimited Resumes', included: true },
        { name: '200 AI Credits/mo', included: true },
        { name: 'All Templates', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Priority Support', included: true },
      ])),
    },
  });

  // Create portfolio templates
  await prisma.portfolioTemplate.upsert({
    where: { slug: 'developer-minimal' },
    update: {},
    create: {
      name: 'Developer Minimal',
      slug: 'developer-minimal',
      description: 'Clean minimal portfolio for developers',
      category: 'developer',
      isPremium: false,
      theme: JSON.parse(JSON.stringify({ primaryColor: '#2563EB', fontFamily: 'Inter', mode: 'light' })),
      sections: JSON.parse(JSON.stringify(['HERO', 'ABOUT', 'PROJECTS', 'SKILLS', 'EXPERIENCE', 'CONTACT'])),
    },
  });

  await prisma.portfolioTemplate.upsert({
    where: { slug: 'designer-showcase' },
    update: {},
    create: {
      name: 'Designer Showcase',
      slug: 'designer-showcase',
      description: 'Visual-first portfolio for designers',
      category: 'designer',
      isPremium: false,
      theme: JSON.parse(JSON.stringify({ primaryColor: '#7c3aed', fontFamily: 'Inter', mode: 'dark' })),
      sections: JSON.parse(JSON.stringify(['HERO', 'PROJECTS', 'CASE_STUDY', 'ABOUT', 'TESTIMONIALS', 'CONTACT'])),
    },
  });

  await prisma.portfolioTemplate.upsert({
    where: { slug: 'creative-pro' },
    update: {},
    create: {
      name: 'Creative Pro',
      slug: 'creative-pro',
      description: 'Premium portfolio with stunning animations',
      category: 'creative',
      isPremium: true,
      theme: JSON.parse(JSON.stringify({ primaryColor: '#0891b2', fontFamily: 'Inter', mode: 'dark' })),
      sections: JSON.parse(JSON.stringify(['HERO', 'ABOUT', 'PROJECTS', 'CASE_STUDY', 'SKILLS', 'TESTIMONIALS', 'CONTACT'])),
    },
  });

  // Seed prompt templates
  const prompts = [
    {
      name: 'portfolio_bio',
      type: 'PORTFOLIO_BIO',
      systemPrompt: 'You are a professional branding expert. Generate a compelling, concise professional bio.',
      userPrompt: 'Write a professional bio for {{name}}, a {{role}}. Skills: {{skills}}. Experience: {{experience}}.',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 500,
    },
    {
      name: 'resume_optimize',
      type: 'RESUME_OPTIMIZE',
      systemPrompt: 'You are an expert resume writer and ATS optimization specialist.',
      userPrompt: 'Optimize this resume for the role: {{targetRole}}. Job description: {{jobDescription}}. Current resume: {{resume}}.',
      model: 'gpt-4o',
      temperature: 0.5,
      maxTokens: 3000,
    },
    {
      name: 'case_study',
      type: 'CASE_STUDY',
      systemPrompt: 'You are a technical writer who creates compelling project case studies.',
      userPrompt: 'Write a case study for the project: {{projectName}}. Description: {{description}}. Tech: {{technologies}}.',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000,
    },
  ];

  for (const prompt of prompts) {
    await prisma.promptTemplate.upsert({
      where: { name: prompt.name },
      update: {},
      create: prompt,
    });
  }

  console.log('✅ Seed completed');
  console.log(`   Plans: ${freePlan.name}, ${proPlan.name}, ${proPlusPlan.name}`);
  console.log('   Templates: 3 portfolio templates');
  console.log('   Prompts: 3 prompt templates');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
