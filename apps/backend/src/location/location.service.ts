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

  async getLocationWeather(
    locationId: string,
    startTime: Date,
    endTime?: Date
  ): Promise<Weather[]> {
    let locationWeatherQuery = this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :locationId', { locationId: locationId })
      .leftJoinAndSelect('location.weather', 'weather')
      .where('weather.dateTime > :startTime', {
        startTime: startTime,
      });

    if (endTime) {
      locationWeatherQuery = locationWeatherQuery.andWhere(
        'weather.dateTime < :endTime',
        {
          endTime: endTime,
        }
      );
    }

    return (await locationWeatherQuery.getOne())?.weather;
  }
}
