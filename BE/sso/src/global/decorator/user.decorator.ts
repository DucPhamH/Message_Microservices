// auth/decorators/user.decorator.ts (Custom decorator đơn giản)
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface User {
  userId: string;
  username: string;
  email: string;
}

export const User = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return data ? user?.[data] : user;
  },
);
