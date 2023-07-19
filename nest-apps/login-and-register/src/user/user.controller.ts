import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  UseGuards,
  ValidationPipe,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from './permission.guard';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('init')
  async initData() {
    await this.userService.initData();
    return '插入成功';
  }

  /**
   *
   * @param user 登录
   */
  @Post('login')
  async create(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      const authorization = `bearer ${token}`;
      res.setHeader('authorization', authorization);
      return authorization;
    } else {
      return '登录失败';
    }
  }

  /**
   *
   * @param user 注册用户
   */
  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Get('getUser')
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'create')
  getUserInfo() {
    return '获取用户信息1';
  }

  @Get('getHotUser')
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'create')
  getHotUser() {
    return '热门用户';
  }
}
