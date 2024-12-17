import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  start?: Date;

  @IsOptional()
  @IsNotEmpty()
  end?: Date;
}
