# 🚀 PortfolioAI

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**PortfolioAI** is a state-of-the-art, AI-powered portfolio builder and career intelligence SaaS platform. It helps professionals build stunning portfolios, optimize their resumes for ATS, and chart their career growth using advanced AI orchestration.

---

## ✨ Key Features

- 🛠️ **Dynamic Portfolio Editor**: Real-time editor with multiple premium templates.
- 🤖 **AI Content Generation**: Automated bio, experience, and project descriptions using LangChain & OpenAI.
- 📄 **ATS Resume Optimizer**: Analyze and optimize your resume for specific job descriptions.
- 🗺️ **Career Roadmap**: Personalized skill development plans to reach your target roles.
- 🔗 **Social Integrations**: One-click import from GitHub, LinkedIn, and more.
- 📊 **Analytics Dashboard**: Track views and engagement on your public portfolio.

---

## 🏗️ Architecture

Built as a high-performance monorepo using **Turborepo**:

### 📱 Applications
- **`apps/web`**: Next.js 15 (App Router) frontend. Uses TailwindCSS v4 for sleek, modern styling.
- **`apps/api`**: NestJS REST backend handling authentication, user profiles, and business logic.
- **`apps/ai-service`**: FastAPI microservice dedicated to AI orchestration and LLM processing.

### 📦 Shared Packages
- **`@portfolioai/ui`**: A comprehensive, accessible design system built on shadcn/ui.
- **`@portfolioai/database`**: Type-safe database access with Prisma ORM.
- **`@portfolioai/types`**: Shared TypeScript definitions and Zod validation schemas.
- **`@portfolioai/utils`**: Core utility functions and shared logic.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: v20+
- **pnpm**: v9+
- **Python**: v3.11+
- **PostgreSQL**: Local instance or via Docker

### 🛠️ Installation & Setup

1. **Clone and Initialize**:
   ```bash
   git clone https://github.com/your-username/PortfolioAI.git
   cd PortfolioAI
   pnpm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Update .env with your OpenAI API Key and Database URL
   ```

3. **Database Migration**:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. **Launch Development Environment**:
   ```bash
   pnpm dev
   ```
   * Access the Frontend: `http://localhost:3005`
   * Access the API: `http://localhost:4005`

---

## 🧪 Testing

We maintain high code quality through a comprehensive testing suite:

- **Unit Testing**: 
  - API: `pnpm run test --filter=@portfolioai/api` (Jest)
  - Web: `pnpm run test --filter=@portfolioai/web` (Jest/RTL)
  - AI Service: `pytest apps/ai-service/tests`
- **End-to-End**: 
  - Playwright suite for critical user flows (coming soon).

---

## 🐳 Docker Deployment

For a production-like local environment:
```bash
docker-compose up -d
```

---

## 🗺️ Roadmap

- [x] Phase 1: Core Foundation & Monorepo Setup
- [x] Phase 2: AI Orchestration & Editor MVP
- [ ] Phase 3: Advanced Analytics & Team Features
- [ ] Phase 4: Mobile Application (React Native)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
