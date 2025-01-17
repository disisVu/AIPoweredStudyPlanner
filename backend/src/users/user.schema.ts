import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  uid: string;

  @Prop({ type: String, default: null })
  activeFocusTimerId: string | null;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  resetPasswordToken?: string; // Token for resetting password

  @Prop()
  resetPasswordExpires?: Date; // Token expiration date
}

export const UserSchema = SchemaFactory.createForClass(User);
