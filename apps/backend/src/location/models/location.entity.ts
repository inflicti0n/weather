import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Weather } from './weather.entity';

@Entity()
export class Location {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @OneToMany(() => Weather, (weather) => weather.location)
  weather: Weather[];
}
