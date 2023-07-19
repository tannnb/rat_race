import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('请求前...');
    next();
  }
}

// 如果是直接函数类型，可以直接在全局进行 app.use(logger) 即可
// export function logger(req: Request, res: Response, next: NextFunction) {
//   console.log('请求前...');
//   next();
// }
