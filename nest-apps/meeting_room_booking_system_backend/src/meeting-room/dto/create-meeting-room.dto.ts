import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMeetingRoomDto {
  @ApiProperty()
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @MaxLength(10, { message: '会议室名称长度最大的10个字符' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '容量不能为空' })
  capacity: number;

  @ApiProperty()
  @IsNotEmpty({ message: '位置不能为空' })
  @MaxLength(50, { message: '位置最长为50个字符' })
  location: string;

  @ApiProperty()
  @IsNotEmpty({ message: '设备不能为空' })
  equipment: string;

  @ApiProperty()
  description: string;
}
