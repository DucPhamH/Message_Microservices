import { createZodDto } from 'nestjs-zod';
import { OtpSchema } from '../model/otp.schema';
import z from 'zod';

export const CreateOtpBodySchema = OtpSchema.pick({
  email: true,
  type: true,
});

export const CheckOtpBodySchema = OtpSchema.pick({
  email: true,
  code: true,
  type: true,
});

export type CreateOtpBodyType = z.infer<typeof CreateOtpBodySchema>;
export type CheckOtpBodyType = z.infer<typeof CheckOtpBodySchema>;

export class CreateOtpBodyDto extends createZodDto(CreateOtpBodySchema) {}
export class CheckOtpBodyDto extends createZodDto(CheckOtpBodySchema) {}
