import { RedisClientType } from 'redis';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { Booking } from './entities/booking.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async initDara() {
    const user1 = await this.entityManager.findOneBy(User, { id: 6 });
    const user2 = await this.entityManager.findOneBy(User, { id: 10 });
    const room1 = await this.entityManager.findOneBy(MeetingRoom, { id: 5 });
    const room2 = await this.entityManager.findOneBy(MeetingRoom, { id: 6 });

    const bookingt1 = new Booking();
    bookingt1.room = room1;
    bookingt1.user = user1;
    bookingt1.startTime = new Date();
    bookingt1.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, bookingt1);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking4);
  }

  async find(
    pageNo: number,
    pageSize: number,
    username: string,
    meetingRoomName: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number,
  ) {
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }
    if (meetingRoomPosition) {
      if (!condition.room) {
        condition.room = {};
      }
      condition.room.location = Like(`%${meetingRoomPosition}%`);
    }

    if (bookingTimeRangeStart) {
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }
      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd),
      );
    }

    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        where: condition,
        relations: {
          user: true,
          room: true,
        },
        skip: skipCount,
        take: pageSize,
      },
    );
    return {
      bookings: bookings.map((item) => {
        delete item.user.password;
        return item;
      }),
      totalCount,
    };
  }

  async add(bookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: bookingDto.meetingRoomId,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });
    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user;
    booking.startTime = new Date(bookingDto.startTime);
    booking.endTime = new Date(bookingDto.endTime);

    const res = await this.entityManager.findOneBy(Booking, {
      room: {
        id: meetingRoom.id,
      },
      startTime: LessThanOrEqual(booking.startTime),
      endTime: MoreThanOrEqual(booking.endTime),
    });
    if (res) {
      throw new BadRequestException('该时间段已被预定');
    }

    await this.entityManager.save(Booking, booking);
  }

  async apply(id: number) {
    return this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: '审批通过',
      },
    );
  }
  async reject(id: number) {
    return this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: '驳回',
      },
    );
  }
  async unbind(id: number) {
    return this.entityManager.update(
      Booking,
      {
        id,
      },
      {
        status: '已解除',
      },
    );
  }

  async urge(id: number) {
    const flag = await this.redisService.getKey('urge_' + id);

    if (flag) {
      throw new BadRequestException('半小时内只能催办一次，请耐心等待');
    }

    let email = await this.redisService.getKey('admin_email');
    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });
      email = admin.email;
      this.redisService.setKey('admin_email', email);
    }

    this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id 为 ${id} 的预定申请正在等待审批`,
    });

    this.redisService.setKey('urge_' + id, 1, 60 * 30);
  }
}
