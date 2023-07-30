import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { Permission } from './Permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '角色名' })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_peimissions' })
  permissions: Permission[];
}
