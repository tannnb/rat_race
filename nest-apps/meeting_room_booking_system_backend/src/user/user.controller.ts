import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

import { RequireLogin, UserInfo as UserInfoQuery } from 'src/custom.decorator';

import { RegisterUserDto } from './dto/register.dot';
import { LoginUserDto } from './dto/login-user.dot';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { LoginUserVo, UserInfo } from './vo/login-user.vo';
import { UserDetailVO } from './vo/user-info.vo';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  @Inject(UserService)
  private userService: UserService;

  @Inject(EmailService)
  private emailServer: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(ConfigService)
  private configServer: ConfigService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return '数据初始化成功';
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('reigster')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @ApiOperation({ summary: '注册验证码' })
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: '123456@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
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

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户名不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, false);
    const { accessToken, refreshToken } = this.normalizeToken(userVo);
    userVo.accessToken = accessToken;
    userVo.refreshToken = refreshToken;
    return userVo;
  }

  @ApiOperation({ summary: '管理员登录' })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户名不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, true);
    const { accessToken, refreshToken } = this.normalizeToken(userVo);
    userVo.accessToken = accessToken;
    userVo.refreshToken = refreshToken;
    return userVo;
  }

  @ApiOperation({ summary: '刷新Token' })
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    required: true,
    example: 'Bearer *****',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);
      const { access_token, refresh_token } = this.normalizeRefreshToken(
        user as UserInfo,
      );

      const vo = new RefreshTokenVo();
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;

      return vo;
    } catch (error) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @ApiOperation({ summary: '刷新admin,Token' })
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    required: true,
    example: 'Bearer *****',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('admin/refresh')
  async adminrRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const { access_token, refresh_token } = this.normalizeRefreshToken(
        user as UserInfo,
      );
      const vo = new RefreshTokenVo();
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;
      return vo;
    } catch (error) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @ApiOperation({ summary: '用户信息' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVO,
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfoQuery('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);

    const userVO = new UserDetailVO();
    userVO.id = user.id;
    userVO.username = user.username;
    userVO.nickName = user.nickName;
    userVO.avatar = user.avatar;
    userVO.email = user.email;
    userVO.phoneNumber = user.avatar;
    userVO.createTime = user.createTime;
    userVO.isFrozen = user.isFrozen;
    return userVO;
  }

  @ApiOperation({ summary: '修改密码' })
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确',
  })
  @Post(['update_password', 'admin/update_password'])
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  @ApiOperation({ summary: '密码验证码' })
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @Get('update_password/captcha')
  async updatePaddwordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.setKey(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );
    await this.emailServer.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: String,
    description: '发送成功',
  })
  @RequireLogin()
  @Get('update/captcha')
  async updateCaptcha(@UserInfoQuery('email') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.setKey(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );
    await this.emailServer.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的更验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @ApiOperation({ summary: '用户信息更新' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfoQuery('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({ summary: '冻结用户' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: '用户ID',
    type: Number,
  })
  @ApiResponse({
    type: String,
    description: 'success',
  })
  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @ApiOperation({ summary: '用户列表', description: '用户列表接口' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: String,
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: String,
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: '用户列表',
  })
  @RequireLogin()
  @Get('list')
  async list(
    @Query('pageNo', generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query('pageSize', generateParseIntPipe('pageSize'))
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
    @UserInfoQuery('userId') userId: number,
  ) {
    return await this.userService.findUsersByPage(
      pageNo,
      pageSize,
      username,
      nickName,
      email,
      userId,
    );
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          try {
            fs.mkdirSync('uploads');
          } catch (e) {}
          callback(null, 'uploads');
        },
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname);
        if (['.png', '.jpg', '.gif', '.java'].includes(extname)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return file.path;
  }

  normalizeToken(vo: LoginUserVo) {
    return {
      accessToken: this.jwtService.sign(
        {
          userId: vo.userInfo.id,
          username: vo.userInfo.username,
          roles: vo.userInfo.roles,
          email: vo.userInfo.email,
          permissions: vo.userInfo.permissions,
        },
        {
          expiresIn:
            this.configServer.get('jwt_access_token_expires_time') || '30m',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          userId: vo.userInfo.id,
        },
        {
          expiresIn:
            this.configServer.get('jwt_refresh_token_expires_time') || '7d',
        },
      ),
    };
  }

  normalizeRefreshToken(vo: UserInfo) {
    return {
      access_token: this.jwtService.sign(
        {
          userId: vo.id,
          username: vo.username,
          roles: vo.roles,
          email: vo.email,
          permissions: vo.permissions,
        },
        {
          expiresIn:
            this.configServer.get('jwt_access_token_expires_time') || '30m',
        },
      ),
      refresh_token: this.jwtService.sign(
        {
          userId: vo.id,
        },
        {
          expiresIn:
            this.configServer.get('jwt_refresh_token_expires_time') || '7d',
        },
      ),
    };
  }
}
