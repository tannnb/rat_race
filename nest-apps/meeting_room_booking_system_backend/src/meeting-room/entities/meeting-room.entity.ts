import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn({ comment: '会议室ID' })
  id: number;

  @Column({ comment: '会议室名字', length: 50 })
  name: string;

  @Column({ comment: '会议室容量' })
  capacity: number;

  @Column({ comment: '会议室位置', length: 50 })
  location: string;

  @Column({ comment: '设备', length: 50, default: '' })
  equipment: string;

  @Column({ comment: '描述', length: 100, default: '' })
  description: string;

  @Column({ comment: '是否被预定', default: false })
  isBooked: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    // transformer: {
    //   to(value: Date): number {
    //     return value.getTime(); // 将 Date 转换为时间戳
    //   },
    //   from(value: number): Date {
    //     return new Date(value); // 将时间戳转换为 Date
    //   },
    // },
  })
  createTime: number;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    // transformer: {
    //   to(value: Date): number {
    //     return value.getTime(); // 将 Date 转换为时间戳
    //   },
    //   from(value: number): Date {
    //     return new Date(value); // 将时间戳转换为 Date
    //   },
    // },
  })
  updateTime: number;
}
