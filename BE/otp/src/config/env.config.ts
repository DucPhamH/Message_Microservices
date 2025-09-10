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
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_HOST: z.string().min(1, 'REDIS_HOST is required'),
  REDIS_PORT: z
    .string()
    .min(1)
    .transform((v) => {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error('REDIS_PORT must be a number');
      return n;
    }),
  REDIS_PASSWORD: z.string().optional().nullable(),
  REDIS_TLS: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
  REDIS_DB: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 0;
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error('REDIS_DB must be a number');
      return n;
    })
    .default(0),
  REDIS_KEY_PREFIX: z.string().optional().default('sso:'),
  REDIS_MAX_RETRIES_PER_REQ: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 5;
      const n = Number(v);
      if (Number.isNaN(n))
        throw new Error('REDIS_MAX_RETRIES_PER_REQ must be a number');
      return n;
    })
    .default(5),
  REDIS_ENABLE_OFFLINE_QUEUE: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return true;
      return v === 'true' || v === '1';
    })
    .default(true),
  REDIS_RETRY_DELAY_MS: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 200;
      const n = Number(v);
      if (Number.isNaN(n))
        throw new Error('REDIS_RETRY_DELAY_MS must be a number');
      return n;
    })
    .default(200),
  REDIS_CONNECT_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 10000;
      const n = Number(v);
      if (Number.isNaN(n))
        throw new Error('REDIS_CONNECT_TIMEOUT_MS must be a number');
      return n;
    })
    .default(10000),
  AT_SECRET_KEY: z.string().min(1, 'AT_SECRET_KEY is required'),
  AT_EXPIRES_IN: z.string().min(1, 'AT_EXPIRES_IN is required'),
  RT_SECRET_KEY: z.string().min(1, 'RT_SECRET_KEY is required'),
  RT_EXPIRES_IN: z.string().min(1, 'RT_EXPIRES_IN is required'),
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
