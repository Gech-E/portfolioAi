import { z } from 'zod';

/**
 * We use a simple environment validator to ensure the frontend has all required environment variables at build time and runtime.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};

let env = processEnv as Record<string, any>;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined';

  const parsed = isServer
    ? z.intersection(serverSchema, clientSchema).safeParse(processEnv)
    : clientSchema.safeParse(processEnv);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_')) {
        throw new Error(
          `❌ Attempted to access a server-side environment variable '${prop}' on the client`,
        );
      }
      return target[prop as keyof typeof target];
    },
  });
}

export { env };
