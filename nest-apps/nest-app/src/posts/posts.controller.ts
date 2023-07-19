import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts模块')
@Controller('posts')
export class PostsController {
  @ApiOperation({ summary: '测试' })
  @Get('getTest')
  getUserList(): string {
    return '测试一下';
  }
}
