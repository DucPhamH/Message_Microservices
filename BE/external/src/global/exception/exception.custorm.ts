// src/common/exceptions/prisma-unique.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class PrismaUniqueException extends HttpException {
  constructor(model: string, field: string[]) {
    super(
      {
        message: `${model} with ${field.join(', ')} already exists`,
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT, // 409
      },
      HttpStatus.CONFLICT, // status code HTTP
    );
  }
}
