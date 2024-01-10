import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { boolean } from 'yargs';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '4K液晶电视';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '普罗旺斯';
    room2.capacity = 30;
    room2.equipment = '4K液晶电视,多功能媒体';
    room2.location = '一层西B2';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 12;
    room3.equipment = '4K液晶电视';
    room3.location = '二层西';

    this.repository.insert([room1, room2, room3]);
  }

  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    equipment: string,
    isBooked: boolean,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为1');
    }
    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (typeof isBooked === 'string') {
      condition.isBooked = JSON.parse(isBooked);
    }
    const skipCount = (pageNo - 1) * pageSize;
    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
      order: {
        createTime: 'DESC', // 按时间戳字段倒序排序
      },
    });
    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名称已存在');
    }
    return await this.repository.insert(meetingRoomDto);
  }

  async update(meetingRoom: UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id: meetingRoom.id,
    });
    if (!room) {
      throw new BadRequestException('会议室不存在');
    }
    room.capacity = meetingRoom.capacity;
    room.location = meetingRoom.location;
    room.name = meetingRoom.name;

    if (meetingRoom.description) {
      room.description = meetingRoom.description;
    }
    if (meetingRoom.equipment) {
      room.equipment = meetingRoom.equipment;
    }

    await this.repository.update(
      {
        id: meetingRoom.id,
      },
      room,
    );
    return 'success';
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }
  async delete(id: number) {
    return this.repository.delete({ id });
  }
}
