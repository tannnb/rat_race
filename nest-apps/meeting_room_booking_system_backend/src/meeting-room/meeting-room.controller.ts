import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPipe } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin } from 'src/custom.decorator';
import { MeetingRoomVo } from './vo/meeting-room.vo';
import { MeetingRoomListVo } from './vo/meeting-room-list.vo';

@ApiTags('会议室管理模块')
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @ApiBearerAuth()
  @ApiQuery({ name: 'pageNo', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'capacity', type: String, required: false })
  @ApiQuery({ name: 'equipment', type: String, required: false })
  @ApiQuery({ name: 'isBooked', type: Boolean, required: false })
  @ApiResponse({ type: MeetingRoomListVo })
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
    @Query('isBooked') isBooked: boolean,
  ) {
    return await this.meetingRoomService.find(
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
      isBooked,
    );
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateMeetingRoomDto })
  @ApiResponse({ status: HttpStatus.OK, description: '会议室已存在' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: MeetingRoomVo })
  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateMeetingRoomDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '会议室不存在' })
  @Post('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: MeetingRoomVo,
  })
  @Get(':id')
  async find(@Param('id') id: number) {
    return this.meetingRoomService.findById(id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: 'id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'success' })
  @RequireLogin()
  @Post(':id')
  async delete(@Param('id') id: number) {
    return this.meetingRoomService.delete(id);
  }
}
