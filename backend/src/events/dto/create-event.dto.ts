import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  start: Date;

  @IsNotEmpty()
  end: Date;
}
