import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dot';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reigster')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
}
