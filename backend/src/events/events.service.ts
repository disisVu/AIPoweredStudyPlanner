import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '@/events/event.schema';
import { CreateEventDto } from '@/events/dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const newEvent = new this.eventModel(createEventDto);
    await newEvent.save();
    return newEvent;
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await this.eventModel.find({ userId }).exec();
  }
}
