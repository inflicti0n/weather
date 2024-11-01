import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class WeatherDateRangeDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime: Date;
}
