import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  //   H: High
  //   M: Medium
  //   L: Low
  @IsNotEmpty()
  @IsEnum(['H', 'M', 'L'])
  priority: 'H' | 'M' | 'L';

  // T: Todo
  // IP: In Progress
  // C: Completed
  // E: Expired
  @IsOptional()
  @IsEnum(['T', 'IP', 'C', 'E'])
  status?: 'T' | 'IP' | 'C' | 'E';

  @IsOptional()
  @IsInt()
  estimatedTime?: number;

  @IsOptional()
  deadline?: Date;
}
