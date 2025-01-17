import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  //   H: High
  //   M: Medium
  //   L: Low
  @Prop({ required: true, enum: ['H', 'M', 'L'] })
  priority: 'H' | 'M' | 'L';

  // T: Todo
  // IP: In Progress
  // C: Completed
  // E: Expired
  @Prop({ default: 'T', enum: ['T', 'IP', 'C', 'E'] })
  status: 'T' | 'IP' | 'C' | 'E';

  @Prop()
  estimatedTime: number;

  @Prop()
  deadline: Date;

  @Prop({ default: false })
  isDistributed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
