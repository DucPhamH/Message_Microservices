// src/user/schemas/user.schema.ts
import { UserStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UsersSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  status: z.enum([
    UserStatus.ONLINE,
    UserStatus.OFFLINE,
    UserStatus.AWAY,
    UserStatus.BUSY,
  ]),
  isOnline: z.boolean(),
  lastSeenAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  password: z.string(),
});

// Export type để dùng lại trong service/controller
export class UserDto extends createZodDto(UsersSchema) {}
