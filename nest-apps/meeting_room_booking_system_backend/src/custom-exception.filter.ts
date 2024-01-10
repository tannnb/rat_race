import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse<Response>();

    const res = exception.getResponse() as { message: string[] };
    // console.log('exception', exception);
    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: res?.message?.join ? res?.message?.join(',') : exception.message,
      })
      .end();
  }
}
