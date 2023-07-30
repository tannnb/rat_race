import { Permission } from './user/entities/permission.entity';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      Permission: string[];
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('token错误');
    }
    try {
      const token = bearer[1];
      const info = this.jwtService.verify(token);
      request.user = info.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }
}
