import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repo';
import { AUTH_MESSAGES } from 'src/global/constants/message.constant';
import { AppLoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: AppLoggerService,

  ) { }

  async findOne(id: string) {
    const user = await this.userRepository.findByUserId(id);

    if (!user) {
      this.logger.warn('User not found', UserService.name, {
        id: id,
      });
      throw new ConflictException(AUTH_MESSAGES.NOT_FOUND_USER);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

}
