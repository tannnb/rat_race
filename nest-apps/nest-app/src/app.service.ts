import { Injectable } from '@nestjs/common';
import { sourceData } from './source';
import { CreateAppDto } from './app.dto';

@Injectable()
export class AppService {
  getUserList(): Record<string, any>[] {
    return sourceData;
  }
  createInfo1(id: string): Record<string, any>[] {
    return [{ id, name: 'apple' }];
  }
  createInfo(userInfo: CreateAppDto): Record<string, any>[] {
    return [userInfo];
  }
}
