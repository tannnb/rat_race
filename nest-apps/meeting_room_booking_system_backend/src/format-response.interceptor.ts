import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          message: 'success',
          data,
        };
      }),
    );
  }
}
