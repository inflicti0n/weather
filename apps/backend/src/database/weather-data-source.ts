import { DataSource } from 'typeorm';
import { Location } from '../location/models/location.entity';
import { Weather } from '../location/models/weather.entity';

export const WeatherDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [Location, Weather],
  synchronize: true,
  logging: false,
});
