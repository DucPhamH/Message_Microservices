import { createZodDto } from 'nestjs-zod';
import { OtpSchema } from 'src/global/model/otp.schema';

export const CreateOtpBodySchema = OtpSchema.pick({
  email: true,
  type: true,
});

export const CheckOtpBodySchema = OtpSchema.pick({
  email: true,
  code: true,
  type: true,
});

export const OtpResponseSchema = OtpSchema.omit({
  code: true,
});

export const SendOtpEmailSchema = OtpSchema.pick({
  email: true,
  code: true,
});

export class CreateOtpBodyDto extends createZodDto(CreateOtpBodySchema) {}
export class CheckOtpBodyDto extends createZodDto(CheckOtpBodySchema) {}
export class OtpResponseDto extends createZodDto(OtpResponseSchema) {}
export class SendOtpEmailDto extends createZodDto(SendOtpEmailSchema) {}
