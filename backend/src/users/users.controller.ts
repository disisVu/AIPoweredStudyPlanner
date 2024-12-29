import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FocusTimersService } from '@/focus-timers/focus-timers.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly focusTimersService: FocusTimersService,
  ) {}

  @Get(':uid/active-focus-timer')
  async getActiveFocusTimer(@Param('uid') uid: string) {
    let user = await this.usersService.findByUid(uid);
    if (!user) {
      user = await this.usersService.createUser(uid);
    }
    if (!user.activeFocusTimerId) {
      return null;
    }
    return this.focusTimersService.getFocusTimerById(user.activeFocusTimerId);
  }

  @Put(':uid/active-focus-timer')
  async setActiveFocusTimer(
    @Param('uid') uid: string,
    @Body('focusTimerId') focusTimerId: string,
  ) {
    let user = await this.usersService.findByUid(uid);
    if (!user) {
      user = await this.usersService.createUser(uid);
    }
    user = await this.usersService.setActiveFocusTimer(uid, focusTimerId);
    return user;
  }

  @Delete(':uid/active-focus-timer')
  async clearActiveFocusTimer(@Param('uid') uid: string) {
    let user = await this.usersService.findByUid(uid);
    if (!user) {
      user = await this.usersService.createUser(uid);
    }
    user = await this.usersService.clearActiveFocusTimer(uid);
    return user;
  }
}
