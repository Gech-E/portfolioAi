import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4005),
  APP_URL: z.string().url().default('http://localhost:3005'),
  API_URL: z.string().url().default('http://localhost:4005'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10).default('dev-secret-change-in-production-please-update-me'),
  JWT_REFRESH_SECRET: z.string().min(10).default('dev-refresh-secret-change-in-production-now'),
  RATE_LIMIT_TTL: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}
