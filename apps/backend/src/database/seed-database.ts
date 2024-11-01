import { Location } from '../location/models/location.entity';
import { Weather, WeatherConditions } from '../location/models/weather.entity';
import { WeatherDataSource } from './weather-data-source';
import { Logger } from '@nestjs/common';

export async function SeedDatabase() {
  const location1: Location = new Location();
  Object.assign(location1, {
    id: '1',
    name: 'Location One',
  });

  await WeatherDataSource.manager.save<Location>(location1);

  await WeatherDataSource.manager.insert(Weather, {
    id: '1',
    location: location1,
    dateTime: new Date().toISOString(),
    airQualityIndex: 5,
    humidityPercent: 50,
    precipitationProbabilityPercent: 70,
    temperatureCelsius: 15,
    uvIndex: 26,
    weatherCondition: WeatherConditions.clear,
    windGustsKmh: 20,
    windSpeedKmh: 10,
  });

  await WeatherDataSource.manager.insert(Weather, {
    id: '2',
    location: location1,
    dateTime: new Date().toISOString(),
    airQualityIndex: 5,
    humidityPercent: 50,
    precipitationProbabilityPercent: 70,
    temperatureCelsius: 15,
    uvIndex: 26,
    weatherCondition: WeatherConditions.clear,
    windGustsKmh: 20,
    windSpeedKmh: 10,
  });

  Logger.log(`🌱 Database seeding completed`);
}
