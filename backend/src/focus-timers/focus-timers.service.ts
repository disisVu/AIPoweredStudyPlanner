import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FocusTimer,
  FocusTimerDocument,
} from '@/focus-timers/focus-timers.schema';
import { CreateFocusTimerDto } from '@/focus-timers/dto/create-focus-timer.dto';
import { TasksService } from '@/tasks/tasks.service';

@Injectable()
export class FocusTimersService {
  constructor(
    @InjectModel(FocusTimer.name)
    private readonly focusTimerModel: Model<FocusTimerDocument>,
    private readonly tasksService: TasksService,
  ) {}

  async createFocusTimer(
    createFocusTimerDto: CreateFocusTimerDto,
  ): Promise<FocusTimer> {
    // Fetch the task to ensure it exists
    const task = await this.tasksService.getTaskById(
      createFocusTimerDto.taskId,
    );

    if (!task) {
      throw new Error('Task not found');
    }

    // Create the new focus timer
    const newFocusTimer = new this.focusTimerModel({
      ...createFocusTimerDto,
    });

    await newFocusTimer.save();

    return newFocusTimer;
  }

  async getFocusTimerByTaskId(taskId: string): Promise<FocusTimer> {
    return await this.focusTimerModel.findOne({ taskId }).exec();
  }

  async getFocusTimerById(focusTimerId: string): Promise<FocusTimer> {
    return await this.focusTimerModel.findById(focusTimerId).exec();
  }

  async getFocusTimersByUserId(userId: string): Promise<FocusTimer[]> {
    return await this.focusTimerModel.find({ userId }).exec();
  }

  async updateFocusTimer(
    focusTimerId: string,
    updateFocusTimerDto: Partial<CreateFocusTimerDto>,
  ): Promise<FocusTimer> {
    const focusTimer = await this.focusTimerModel.findById(focusTimerId);

    if (!focusTimer) {
      throw new Error('Focus Timer not found');
    }

    // Update focus timer fields
    Object.assign(focusTimer, updateFocusTimerDto);

    await focusTimer.save();

    return focusTimer;
  }
}
