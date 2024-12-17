import { IsString, IsOptional, IsBooleanString } from 'class-validator';

export class FilterTasksDto {
  @IsOptional()
  @IsBooleanString()
  isDistributed?: string;

  @IsOptional()
  @IsString()
  priority?: 'H' | 'M' | 'L';

  @IsOptional()
  @IsString()
  status?: 'T' | 'IP' | 'C' | 'E';
}
