import { Controller, Get, Body, Patch, Param, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/global/decorator/public.decorator';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserResponseDto } from './dto/get-user.dto';
import { User } from 'src/global/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) { }

  @Get()
  @ZodSerializerDto(GetUserResponseDto)
  async findOne(@User() user: User): Promise<GetUserResponseDto> {
    return await this.userService.findOne(user.userId);
  }

  @Public()
  @Patch()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
