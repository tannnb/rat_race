import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    const token = bearer[1];
    const info = this.jwtService.verify(token);
    if (!info.user) {
      throw new UnauthorizedException('用户未登录');
    }
    const username = info.user.username;

    // 获取redis中的权限缓存信息
    let permissions = await this.redisService.listGet(
      `user_${username}_permissions`,
    );

    console.log(permissions);

    if (permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(username);
      permissions = foundUser.permissions.map((item) => item.name);
      this.redisService.listSet(
        `user_${username}_permissions`,
        permissions,
        60 * 30,
      );
    }

    const permission = this.reflector.get('permission', context.getHandler());
    if (permissions.some((item) => item === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
