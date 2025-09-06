// src/auth/dto/login.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class RefreshTokenResponseDto extends createZodDto(
  refreshTokenResponseSchema,
) {}

export class RefreshTokenBodyDto extends createZodDto(refreshTokenBodySchema) {}
