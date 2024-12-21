import { IsString, IsOptional, IsBooleanString } from 'class-validator';

export class FilterTasksDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  priority?: 'H' | 'M' | 'L';

  @IsOptional()
  @IsString()
  status?: 'T' | 'IP' | 'C' | 'E';

  @IsOptional()
  deadline?: Date;

  @IsOptional()
  @IsBooleanString()
  isDistributed?: string;
}
