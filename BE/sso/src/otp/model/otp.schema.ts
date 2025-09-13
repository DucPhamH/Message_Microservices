import { OtpCodeType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const OtpSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    OtpCodeType.VERIFY_EMAIL,
    OtpCodeType.FORGOT_PASSWORD,
    OtpCodeType.RESET_PASSWORD,
  ]),
  expiresAt: z.string(),
  createdAt: z.string(),
});

// Export type để dùng lại trong service/controller
export class OtpDto extends createZodDto(OtpSchema) {}
