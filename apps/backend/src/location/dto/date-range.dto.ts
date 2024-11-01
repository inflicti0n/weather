import { IsDateString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class WeatherDateRangeDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime: Date;
}
