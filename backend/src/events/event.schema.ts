import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
