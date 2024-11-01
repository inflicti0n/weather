import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import { WeatherDataSource } from '../database/weather-data-source';
import { Location } from './models/location.entity';
import { Weather } from './models/weather.entity';

@Injectable()
export class LocationService {
  private locationRepository: Repository<Location>;
  private weatherRepository: Repository<Weather>;
  constructor() {
    this.locationRepository = WeatherDataSource.getRepository(Location);
    this.weatherRepository = WeatherDataSource.getRepository(Weather);
  }

  async getLocations(search?: string): Promise<Location[]> {
    return search
      ? this.locationRepository.findBy({
          name: Like(`%${search}%`),
        })
      : this.locationRepository.find();
  }
}
