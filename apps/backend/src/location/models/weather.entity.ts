import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from './location.entity';

export enum WeatherConditions {
  'sunny',
  'partly-sunny',
  'clear',
  'partly-cloudy',
  'overcast',
  'thunderstorm',
  'fog',
  'showers',
  'heavy-rain',
  'rain-with-sun',
  'snowy',
  'sleet',
}

@Entity()
export class Weather {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  dateTime: Date;

  @ApiProperty()
  @Column()
  airQualityIndex: number;

  @ApiProperty()
  @Column()
  humidityPercent: number;

  @ApiProperty()
  @Column()
  precipitationProbabilityPercent: number;

  @ApiProperty()
  @Column()
  temperatureCelsius: number;

  @ApiProperty()
  @Column()
  uvIndex: number;

  @ApiProperty()
  @Column({
    type: 'simple-enum',
    enum: WeatherConditions,
  })
  weatherCondition: WeatherConditions;

  @ApiProperty()
  @Column()
  windGustsKmh: number;

  @ApiProperty()
  @Column()
  windSpeedKmh: number;

  @ApiProperty()
  @ManyToOne(() => Location, (location) => location.weather)
  location: Location;
}
