import { LoginUserDto } from './dto/login-user.dot';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from './entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dot';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Role } from './entities/Role.entity';
import { Permission } from './entities/Permission.entity';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async initData() {
    const user1 = new User();
    user1.username = 'tannnb';
    user1.password = md5('123456');
    user1.email = '123456@qq.com';
    user1.isAdmin = true;
    user1.nickName = '兵乓';
    user1.phoneNumber = '17600001234';

    const user2 = new User();
    user2.username = 'zhangsan';
    user2.password = md5('123456');
    user2.email = '123456@qq.com';
    user2.nickName = '张三';
    user2.phoneNumber = '17600001234';

    const role1 = new Role();
    role1.name = '管理员';
    const role2 = new Role();
    role2.name = '一般用户';

    const permission1 = new Permission();
    permission1.code = 'ADD';
    permission1.description = '访问ADD接口';
    const permission2 = new Permission();
    permission2.code = 'REMOVE';
    permission2.description = '访问REMOVE接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async register(user: RegisterUserDto) {
    // 查询验证码
    const captcha = await this.redisService.getKey(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    console.log('captcha', captcha);
    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    console.log('user', loginUserDto, user);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      createTime: user.createTime,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    return vo;
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user;
  }

  async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.getKey(
      `update_password_captcha_${passwordDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '密码修改失败';
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    // 查找验证码是否过期
    const captcha = await this.redisService.getKey(
      `update_user_captcha_${updateUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const found = await this.userRepository.findOneBy({
      id: userId,
    });
    if (updateUserDto.nickName) {
      found.nickName = updateUserDto.nickName;
    }
    if (updateUserDto.avatar) {
      found.avatar = updateUserDto.avatar;
    }
    try {
      await this.userRepository.save(found);
      return '用户信息修改成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '用户信息修改失败';
    }
  }
}
