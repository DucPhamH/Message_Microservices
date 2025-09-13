// src\user\dto\get-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { UsersSchema } from 'src/global/model/users.schema';

const getUserResponseSchema = UsersSchema.omit({
  password: true,
});

export class GetUserResponseDto extends createZodDto(getUserResponseSchema) { }
