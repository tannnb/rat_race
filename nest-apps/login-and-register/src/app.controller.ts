import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { storage } from './utils';
import { UploadDto } from './app.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: '上传文件', description: '上传文件接口' })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功', type: Array })
  @ApiBody({ type: UploadDto })
  @ApiQuery({
    name: 'files',
    type: Array,
    description: '文件列表',
    required: true,
  })
  @Post('upload')
  @UseInterceptors(
    // FileInterceptor('file', {
    //   dest: 'uploads',
    // }),
    AnyFilesInterceptor({ storage: storage }),
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 500 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const result = (files || []).map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
    return result;
  }
}
