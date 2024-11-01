import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Location } from './location.entity';

export enum WeatherConditions {
  Sunny = 'sunny',
  PartlySunny = 'partly-sunny',
  Clear = 'clear',
  PartlyCloudy = 'partly-cloudy',
  Overcast = 'overcast',
  Thunderstorm = 'thunderstorm',
  Fog = 'fog',
  Showers = 'showers',
  HeavyRain = 'heavy-rain',
  RainWithSun = 'rain-with-sun',
  Snowy = 'snowy',
  Sleet = 'sleet',
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
