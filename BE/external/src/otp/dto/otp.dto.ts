import { createZodDto } from 'nestjs-zod';
import { OtpSchema } from '../model/otp.schema';

export const CreateOtpBodySchema = OtpSchema.pick({
  email: true,
  type: true,
});

export const CheckOtpBodySchema = OtpSchema.pick({
  email: true,
  code: true,
  type: true,
});

export const OtpResSchema = OtpSchema;

export const SendOtpEmailSchema = OtpSchema.pick({
  email: true,
  code: true,
});

export class CreateOtpBodyDto extends createZodDto(CreateOtpBodySchema) {}
export class CheckOtpBodyDto extends createZodDto(CheckOtpBodySchema) {}
export class OtpResDto extends createZodDto(OtpResSchema) {}
export class SendOtpEmailDto extends createZodDto(SendOtpEmailSchema) {}
