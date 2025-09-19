import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export enum OtpCodeType {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export const OtpSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    OtpCodeType.VERIFY_EMAIL,
    OtpCodeType.FORGOT_PASSWORD,
    OtpCodeType.RESET_PASSWORD,
  ]),
  expiresAt: z.date(),
  createdAt: z.date(),
});

// Export type để dùng lại trong service/controller
export class OtpDto extends createZodDto(OtpSchema) {}
