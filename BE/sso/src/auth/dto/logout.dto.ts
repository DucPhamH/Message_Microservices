// src/auth/dto/login.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export class LogoutResponseDto extends createZodDto(logoutResponseSchema) {}

export class LogoutBodyDto extends createZodDto(logoutBodySchema) {}
