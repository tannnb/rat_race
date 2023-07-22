import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // 连接Mysql
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'login_test',
      synchronize: true,
      logging: false,
      entities: [User, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    // 注册jwt服务
    JwtModule.register({
      global: true,
      secret: 'slat',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    RedisModule,

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
