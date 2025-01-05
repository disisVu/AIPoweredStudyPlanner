import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type FocusTimerDocument = FocusTimer & Document;

@Schema({ timestamps: true })
export class FocusTimer {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  focusDuration: number;

  @Prop({ required: true })
  breakDuration: number;

  @Prop({ required: true })
  remainingTime: number;

  @Prop({ required: true })
  timeSpent: number;

  @Prop({ required: true })
  isActive: boolean;
}

export const FocusTimerSchema = SchemaFactory.createForClass(FocusTimer);
