import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Permission } from './entities/permission.entity';

function md5(password: string) {
  const hash = crypto.createHash('md5');
  hash.update(password);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (!foundUser) {
      throw new HttpException('用户名不存在', 200);
    }
    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('账号或密码错误', 200);
    }
    return foundUser;
  }

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已经存在', 200);
    }
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }

  async initData() {
    const insert = new Permission();
    insert.name = 'create';
    insert.desc = '新增Access';

    const remove = new Permission();
    remove.name = 'remove';
    remove.desc = '删除Access';

    const update = new Permission();
    update.name = 'update';
    update.desc = '更新Access';

    const user1 = new User();
    user1.username = 'zhangShan';
    user1.password = '123456';
    user1.permissions = [insert, remove, update];

    const user2 = new User();
    user2.username = 'lishi';
    user2.password = '123456';
    user2.permissions = [insert];

    await this.entityManager.save([insert, remove, update]);
    await this.entityManager.save([user1, user2]);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        permissions: true,
      },
    });
    return user;
  }
}
