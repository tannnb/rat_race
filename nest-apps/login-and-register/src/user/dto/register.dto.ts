import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({
    name: 'username',
    maxLength: 18,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 等字符',
  })
  username: string;

  @ApiPropertyOptional({
    name: 'password',
    maxLength: 18,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
