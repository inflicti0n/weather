import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Weather } from './weather.entity';

@Entity()
export class Location {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @OneToMany(() => Weather, (weather) => weather.location)
  weather: Weather[];
}
