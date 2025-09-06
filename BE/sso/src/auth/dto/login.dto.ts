// src/auth/dto/login.dto.ts
import { createZodDto } from 'nestjs-zod';
import { TokenSchema } from 'src/global/jwt/dto/jwt.dto';
import { z } from 'zod';

export const LoginBodySchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(20).optional(),
    password: z.string().min(6),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.username) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phải cung cấp email hoặc username',
        path: ['email'], // hoặc ['username']
      });
    }

    if (data.email && data.username) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Chỉ được cung cấp email hoặc username, không phải cả hai',
        path: ['email'], // hoặc ['username']
      });
    }
  });

const LoginResponseSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string(),
});

export const LoginResponseWithTokenSchema = z.object({
  user: LoginResponseSchema,
  tokens: TokenSchema,
});

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}
export class LoginResponseDto extends createZodDto(
  LoginResponseWithTokenSchema,
) {}
