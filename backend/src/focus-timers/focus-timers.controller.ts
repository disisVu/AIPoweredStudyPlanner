import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FocusTimerGuard } from './focus-timers.guard';
import { FocusTimersService } from './focus-timers.service';
import { CreateFocusTimerDto } from './dto/create-focus-timer.dto';

@Controller('focus-timers')
@UseGuards(FocusTimerGuard)
export class FocusTimersController {
  constructor(private readonly focusTimersService: FocusTimersService) {}

  @Post()
  createFocusTimer(@Body() createFocusTimerDto: CreateFocusTimerDto) {
    return this.focusTimersService.createFocusTimer(createFocusTimerDto);
  }

  @Get('timer/:focusTimerId')
  getFocusTimerById(@Param('focusTimerId') focusTimerId: string) {
    return this.focusTimersService.getFocusTimerById(focusTimerId);
  }

  @Get('task/:taskId')
  getFocusTimerByTaskId(@Param('taskId') taskId: string) {
    return this.focusTimersService.getFocusTimerByTaskId(taskId);
  }

  @Get('user/:userId')
  getFocusTimersByUserId(@Param('userId') userId: string) {
    return this.focusTimersService.getFocusTimersByUserId(userId);
  }

  @Put(':focusTimerId')
  async updateFocusTimer(
    @Param('focusTimerId') focusTimerId: string,
    @Body() updateFocusTimerDto: Partial<CreateFocusTimerDto>,
  ) {
    return this.focusTimersService.updateFocusTimer(
      focusTimerId,
      updateFocusTimerDto,
    );
  }
}
