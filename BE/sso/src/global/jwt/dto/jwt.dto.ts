import { z } from 'zod';

export const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const PayloadTokenSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type Token = z.infer<typeof TokenSchema>;
export type PayloadToken = z.infer<typeof PayloadTokenSchema>;
