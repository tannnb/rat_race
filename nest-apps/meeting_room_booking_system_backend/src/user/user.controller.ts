import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
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

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, false);
    const { accessToken, refreshToken } = this.normalizeToken(userVo);
    userVo.accessToken = accessToken;
    userVo.refreshToken = refreshToken;
    return userVo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, true);
    const { accessToken, refreshToken } = this.normalizeToken(userVo);
    userVo.accessToken = accessToken;
    userVo.refreshToken = refreshToken;
    return userVo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);
      const { access_token, refresh_token } = this.normalizeRefreshToken(
        user as UserInfo,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminrRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const { access_token, refresh_token } = this.normalizeRefreshToken(
        user as UserInfo,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfoQuery('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);

    const userVO = new UserDetailVO();
    userVO.id = user.id;
    userVO.username = user.username;
    userVO.nickName = user.nickName;
    userVO.avatar = user.avatar;
    userVO.phoneNumber = user.avatar;
    userVO.createTime = user.createTime;
    userVO.isFrozen = user.isFrozen;
    return userVO;
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfoQuery('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

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

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfoQuery('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  normalizeToken(vo: LoginUserVo) {
    return {
      accessToken: this.jwtService.sign(
        {
          userId: vo.userInfo.id,
          username: vo.userInfo.username,
          roles: vo.userInfo.roles,
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
