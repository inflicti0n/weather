import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from './location.entity';

export enum WeatherCondition {
  Clear = 'clear',
  PartlyCloudy = 'partly-cloudy',
  Overcast = 'overcast',
  Thunderstorm = 'thunderstorm',
  Fog = 'fog',
  Showers = 'showers',
  HeavyRain = 'heavy-rain',
  Snowy = 'snowy',
  Sleet = 'sleet',
}

export enum WindDirection {
  North = 'north',
  South = 'south',
  West = 'west',
  East = 'east',
  NorthWest = 'north-west',
  NorthEast = 'north-east',
  SouthWest = 'south-west',
  SouthEast = 'south-east',
}

@Entity()
export class Weather {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'date' })
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
    enum: WeatherCondition,
  })
  weatherCondition: WeatherCondition;

  @ApiProperty()
  @Column()
  windGustsKmh: number;

  @ApiProperty()
  @Column()
  windSpeedKmh: number;

  @ApiProperty()
  @Column({
    type: 'simple-enum',
    enum: WindDirection,
  })
  windDirection: WindDirection;

  @ApiProperty()
  @ManyToOne(() => Location, (location) => location.weather)
  location: Location;
}
