import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './Role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 50, comment: '密码' })
  password: string;

  @Column({ name: 'nick_name', length: 50, comment: '昵称' })
  nickName: string;

  @Column({ length: 50, comment: '邮箱' })
  email: string;

  @Column({
    length: 256,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
  })
  phoneNumber: string;

  @Column({ comment: '是否冻结', default: false })
  isFrozen: boolean;

  @Column({ comment: '是否为管理员', default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
