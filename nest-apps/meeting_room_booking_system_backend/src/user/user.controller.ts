import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dot';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private userService: UserService;

  @Inject(EmailService)
  private emailServer: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Post('reigster')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.setKey(`captcha_${address}`, code, 5 * 60);
    await this.emailServer.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<h4>你的注册验证码是: ${code}</h4>`,
    });
    return '发送成功';
  }
}
