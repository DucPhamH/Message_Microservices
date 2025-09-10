// src/auth/dto/register.dto.ts
import { createZodDto } from 'nestjs-zod';
import { UsersSchema } from 'src/global/model/users.schema';
import { z } from 'zod';

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  displayName: z.string().min(1).max(50),
  password: z.string().min(6),
});

// loại bỏ password trong response
export const RegisterResponseSchema = UsersSchema.omit({
  password: true,
});

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}
