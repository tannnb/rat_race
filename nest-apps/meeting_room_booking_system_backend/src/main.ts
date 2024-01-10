import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // app.enableCors();

  // 参数验证
  app.useGlobalPipes(new ValidationPipe());

  // 返回格式化处理
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  // 请求日志输入
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  // 登录异常捕获
  // app.useGlobalFilters(new UnloginFilter());
  // 自定义异常捕获
  app.useGlobalFilters(new CustomExceptionFilter());

  // 静态文件目录
  app.useStaticAssets('uploads', { prefix: '/uploads' });

  const config = new DocumentBuilder()
    .setTitle('会议预定系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
