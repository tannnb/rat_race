import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAppDto } from './app.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('公共模块')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('getUserList')
  getUserList(): Record<string, any>[] {
    return this.appService.getUserList();
  }

  @ApiOperation({ summary: '创建一个用户1' })
  @Post('list/:id')
  createUser1(@Param('id') id: string): Record<string, any>[] {
    return this.appService.createInfo1(id);
  }

  @ApiOperation({ summary: '创建用户' })
  @Post('addUser')
  createUser(@Body() userInfo: CreateAppDto): Record<string, any>[] {
    return this.appService.createInfo(userInfo);
  }
}
