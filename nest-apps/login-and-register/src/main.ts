import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import { TransformInterceptor } from './transform-interceptor.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 开启跨域
    cors: true,
  });
  // app.enableCors();

  // 注册全局数据格式转换
  app.useGlobalInterceptors(new TransformInterceptor());

  // 配置静态文件资源
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/static',
  });

  // swagger文档配置
  const config = new DocumentBuilder()
    .setTitle('后端api接口文档')
    .setDescription('接口文档描述')
    .setVersion('1.0')
    .addTag('Nest')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 验证',
      name: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
