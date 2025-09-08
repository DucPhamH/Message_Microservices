// src/config/env.config.ts
import path from 'path';
import * as z from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .min(1)
    .transform((v) => {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error('PORT must be a number');
      return n;
    }),
  CORS_ORIGINS: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().default(200),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  UPSTREAM_AUTH: z.string().url(),
  UPSTREAM_SOCKET_SERVICE: z.string().url(),
  PROXY_TIMEOUT_MS: z.coerce.number().default(15_000),
  CLIENT_TIMEOUT_MS: z.coerce.number().default(16_000),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(raw: Record<string, unknown>) {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = JSON.stringify(parsed.error.format(), null, 2);
    throw new Error(`Invalid environment variables:\n${msg}`);
  }
  return parsed.data;
}

export function getEnvFilePathList(): string[] {
  const current = process.env.NODE_ENV || 'development';
  const root = process.cwd(); // thư mục run lệnh
  const primary = path.resolve(root, `.env.${current}`);
  const fallback = path.resolve(root, `.env`);
  return [primary, fallback];
}
