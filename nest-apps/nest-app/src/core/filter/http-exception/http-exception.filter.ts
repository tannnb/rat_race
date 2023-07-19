import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中resonse对象
    const status = exception.getStatus(); // 获取异常状态码
    const responseMessage: any = exception.getResponse();
    let validMessage = '';

    if (typeof responseMessage === 'object') {
      validMessage =
        typeof responseMessage.message === 'string'
          ? responseMessage.message
          : responseMessage.message[0];
    }

    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status > 500 ? 'Server Error' : 'Client Error'}`;

    const errorResponse = {
      data: {},
      message: validMessage || message,
      code: -1,
    };

    response.status(status);
    response.header('Content-Type', 'application/json;charset=utf-8');
    response.send(errorResponse);
  }
}
