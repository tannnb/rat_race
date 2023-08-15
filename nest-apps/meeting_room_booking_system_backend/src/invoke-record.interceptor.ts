import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const userAge = request.headers['user-agent'];
    const { ip, method, path } = request;
    this.logger.debug(
      `${method} ${path} ${ip} ${userAge}:${context.getClass().name}`,
    );
    this.logger.debug(`user:${request.user?.userId},${request.user?.username}`);
    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAge}:${response.statusCode}: ${
            Date.now() - now
          }ms`,
        );
        this.logger.debug(`Response:${JSON.stringify(res)}`);
      }),
    );
  }
}
