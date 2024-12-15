import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '@/tasks/task.schema';
import { Event, EventDocument } from '@/events/event.schema';
import { CreateEventDto } from '@/events/dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const task = await this.taskModel.findById(createEventDto.taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    const newEvent = new this.eventModel({
      ...createEventDto,
      title: task.name,
    });

    await newEvent.save();
    return newEvent;
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await this.eventModel.find({ userId }).exec();
  }
}
