import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppDto {
  @ApiProperty({ description: '用户姓名' })
  @IsNotEmpty({ message: '用户姓名不能为空' })
  readonly name: string;

  @ApiProperty({ description: '年龄' })
  readonly age: number;

  @ApiProperty({ description: '性别' })
  // @IsString({ always: false })
  readonly gender: string;

  @ApiProperty({ description: '邮箱' })
  readonly email: string;

  // @IsString()
  @ApiProperty({ description: '电话' })
  readonly phone: number;

  @ApiProperty({ description: '地址' })
  readonly address: string;
}
