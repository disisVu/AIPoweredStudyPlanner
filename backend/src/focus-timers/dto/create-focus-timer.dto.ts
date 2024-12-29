import { IsNotEmpty, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateFocusTimerDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  eventId: string;

  @IsInt()
  @Min(10)
  focusDuration: number;

  @IsInt()
  @Min(2)
  breakDuration: number;

  @IsInt()
  @Min(0)
  remainingTime: number;

  @IsInt()
  @Min(0)
  timeSpent: number;

  @IsBoolean()
  isActive: boolean;
}
