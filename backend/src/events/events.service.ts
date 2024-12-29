import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '@/events/event.schema';
import { CreateEventDto, UpdateEventDto } from '@/events/dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    private readonly tasksService: TasksService,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    // Fetch the task to ensure it exists
    const task = await this.tasksService.getTaskById(createEventDto.taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Check if the task is already distributed
    if (task.isDistributed) {
      throw new Error('Task has already been distributed on Calendar');
    }

    // Check if an event already exists for this task
    const existingEvent = await this.getEventByTaskId(createEventDto.taskId);
    if (existingEvent) {
      throw new Error('Event of the Task already existed');
    }

    // Create the new event
    const newEvent = new this.eventModel({
      ...createEventDto,
      title: task.name,
    });

    await newEvent.save();

    // Determine new task status
    let newTaskStatus: 'T' | 'IP' | 'C' | 'E' = 'T'; // Default to Todo

    if (createEventDto.start && createEventDto.end) {
      const startDate = new Date(createEventDto.start);
      const deadline = task.deadline ? new Date(task.deadline) : null;

      if (deadline) {
        if (startDate > deadline) {
          newTaskStatus = 'E';
        } else if (startDate <= deadline) {
          newTaskStatus = 'IP';
        }
      }
    }

    // Update the task to set isDistributed = true
    await this.tasksService.updateTask(createEventDto.taskId, {
      status: newTaskStatus,
    });

    return newEvent;
  }

  async getEventByTaskId(taskId: string): Promise<Event> {
    return await this.eventModel.findOne({ taskId }).exec();
  }

  async getEventById(eventId: string): Promise<Event> {
    return await this.eventModel.findById(eventId).exec();
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await this.eventModel.find({ userId }).exec();
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    // Update event fields
    if (updateEventDto.start) event.start = updateEventDto.start;
    if (updateEventDto.end) event.end = updateEventDto.end;
    if (updateEventDto.title) event.title = updateEventDto.title;

    await event.save();

    // Fetch related task
    const taskId = event.taskId;
    const task = await this.tasksService.getTaskById(taskId);

    if (!task) {
      throw new Error('Task not found for the event');
    }

    // Determine new task status
    let newTaskStatus: 'T' | 'IP' | 'C' | 'E' = 'T'; // Default to Todo

    if (updateEventDto.start && updateEventDto.end) {
      const startDate = new Date(updateEventDto.start);
      const deadline = task.deadline ? new Date(task.deadline) : null;

      if (deadline) {
        if (startDate > deadline) {
          newTaskStatus = 'E';
        } else if (startDate <= deadline) {
          newTaskStatus = 'IP';
        }
      }
    }

    // Update task status
    await this.tasksService.updateTask(taskId, { status: newTaskStatus });

    return event;
  }
}
