import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    name: 'username',
    required: true,
    maxLength: 18,
    minLength: 2,
    default: 'zhangShan',
    // enum: ['zhangShan'],
  })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    name: 'password',
    maxLength: 18,
    minLength: 2,
    default: '123456',
    // enum: ['123456'],
  })
  @IsNotEmpty()
  password: string;
}
