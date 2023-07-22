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
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from './permission.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('用户模块')
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

  @ApiOperation({ summary: '用户登录', description: '用户登录接口' })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功', type: String })
  @ApiBody({ type: LoginDto })
  @ApiQuery({
    name: 'password',
    type: String,
    description: '登录密码',
    required: true,
    example: '123456',
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '账号',
    required: true,
    example: 'zhangShan',
  })
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

  @ApiOperation({ summary: '用户注册', description: '用户注册接口' })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功', type: String })
  @ApiBody({ type: RegisterDto })
  @ApiQuery({
    name: 'password',
    type: String,
    description: '登录密码',
    required: true,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '账号',
    required: true,
  })
  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @ApiOperation({ summary: '获取用户信息', description: '获取用户信息详情' })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功', type: String })
  @ApiBearerAuth('bearer')
  @Get('getUser')
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'remove')
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
