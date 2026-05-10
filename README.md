# PortfolioAI

An AI-powered portfolio builder and career intelligence SaaS platform.

## Architecture

This is a monorepo built with Turborepo, containing:

### Apps
- `web`: Next.js 15 (App Router) frontend with TailwindCSS v4 and shadcn/ui.
- `api`: NestJS REST backend for user management, auth, and business logic.
- `ai-service`: FastAPI microservice for AI generation and orchestration using LangChain.

### Packages
- `@portfolioai/ui`: Shared React components.
- `@portfolioai/database`: Prisma ORM and database schemas.
- `@portfolioai/types`: Shared TypeScript types and Zod schemas.
- `@portfolioai/utils`: Shared utility functions.
- `@portfolioai/config`: Shared ESLint, TS, and Prettier configurations.
- `@portfolioai/ai-prompts`: Registry for AI prompt templates.

## Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- Python (v3.11+)
- Docker (optional, for local database)

### Setup

1. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Setup the database (requires a local PostgreSQL instance or Docker):
   ```bash
   # Make sure PostgreSQL is running
   pnpm db:push
   pnpm db:seed
   ```

4. Start the development servers:
   ```bash
   pnpm dev
   ```
   This will start the Next.js app on `http://localhost:3005` and the NestJS API on `http://localhost:4005`.

5. (Optional) Start the AI service in a separate terminal:
   ```bash
   pnpm dev:ai
   ```

## Docker Compose

To run the entire stack using Docker Compose:

```bash
docker-compose up -d
```

## Phase 1 Status

Foundation is complete. Run `pnpm install` once the network issue is resolved.
