import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async setActiveFocusTimer(uid: string, focusTimerId: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { uid },
        { activeFocusTimerId: focusTimerId },
        { new: true },
      )
      .exec();
  }

  async clearActiveFocusTimer(uid: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ uid }, { activeFocusTimerId: null }, { new: true })
      .exec();
  }

  async findByUid(uid: string): Promise<User> {
    return this.userModel.findOne({ uid }).exec();
  }

  async createUser(uid: string): Promise<User> {
    const newUser = new this.userModel({ uid });
    return newUser.save();
  }
}
