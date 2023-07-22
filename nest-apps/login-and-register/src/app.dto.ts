import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadDto {
  @ApiPropertyOptional({
    name: 'files',
  })
  @IsNotEmpty()
  files: Array<File>;
}
