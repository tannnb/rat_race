import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;
    if (!permissions) {
      return true;
    }

    const requirePermission = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );

    if (!requirePermission) {
      return true;
    }

    for (let i = 0; i < requirePermission?.length; i++) {
      const currentPermission = requirePermission[i];
      const found = permissions.find((item) => item.code === currentPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口权限');
      }
    }

    return true;
  }
}
