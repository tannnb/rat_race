import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column({
    length: 100,
    nullable: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 100,
    nullable: true,
    comment: '昵称',
  })
  nickname: string;

  @Exclude()
  @Column({
    comment: '密码',
    nullable: true,
  })
  password: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: '邮箱',
    nullable: true,
  })
  email: string;

  @Column('simple-enum', {
    enum: ['root', 'author', 'visitor'],
    nullable: true,
  })
  role: string; // 用户角色

  @CreateDateColumn({
    name: 'create_time',
    nullable: false,
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    nullable: false,
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return;
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
