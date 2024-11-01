import { Location } from '../location/models/location.entity';
import { Weather, WeatherConditions } from '../location/models/weather.entity';
import { WeatherDataSource } from './weather-data-source';
import { Logger } from '@nestjs/common';

export async function SeedDatabase() {
  const locationsToInsert = generateLocationInserts();
  await WeatherDataSource.manager.save(locationsToInsert);

  locationsToInsert.forEach(async (location: Location) => {
    const weatherToInsert = generateWeatherInsertsForLocation(location);

    await WeatherDataSource.manager.save(weatherToInsert);
  });

  Logger.log(`🌱 Database seeding completed`);
}

export function generateWeatherInsertsForLocation(location: Location) {
  const currentDate = new Date();

  const weatherArray: Weather[] = [];

  let lastGeneratedPresetId = 1;

  for (let day = 0; day < 60; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const dateToAssign = new Date(currentDate);
      dateToAssign.setDate(currentDate.getDate() + day);
      dateToAssign.setHours(hour, 0, 0, 0);

      //Randomly choose a preset for the weather, but clamp it within a range so extreme weather changes are avoided (somewhat)
      const presetIndex = Math.min(
        Math.max(
          Math.floor(
            Math.random() *
              (lastGeneratedPresetId + 3 - (lastGeneratedPresetId - 3) + 1)
          ) +
            lastGeneratedPresetId -
            3,
          1
        ),
        12
      );
      const weather = new Weather();
      Object.assign(weather, {
        location: location,
        dateTime: dateToAssign.toISOString(),
        airQualityIndex: getWeatherPresets()[presetIndex].airQualityIndex,
        humidityPercent: getWeatherPresets()[presetIndex].humidityPercent,
        precipitationProbabilityPercent:
          getWeatherPresets()[presetIndex].precipitationProbabilityPercent,
        temperatureCelsius: getWeatherPresets()[presetIndex].temperatureCelsius,
        uvIndex: getWeatherPresets()[presetIndex].uvIndex,
        weatherCondition: getWeatherPresets()[presetIndex].weatherCondition,
        windGustsKmh: getWeatherPresets()[presetIndex].windGustsKmh,
        windSpeedKmh: getWeatherPresets()[presetIndex].windSpeedKmh,
      });

      lastGeneratedPresetId = presetIndex;

      weatherArray.push(weather);
    }
  }

  return weatherArray;
}

export function getWeatherPresets() {
  return {
    1: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (15 - 0 + 1)) + 0,
      temperatureCelsius: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      uvIndex: Math.floor(Math.random() * (6 - 3 + 1)) + 3,
      weatherCondition: WeatherConditions.Sunny,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    2: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (1 - 0 + 1)) + 0,
      temperatureCelsius: Math.floor(Math.random() * (27 - 12 + 1)) + 12,
      uvIndex: Math.floor(Math.random() * (4 - 2 + 1)) + 2,
      weatherCondition: WeatherConditions.PartlySunny,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    3: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (10 - 0 + 1)) + 0,
      temperatureCelsius: Math.floor(Math.random() * (24 - 0 + 1)) + 0,
      uvIndex: 4,
      weatherCondition: WeatherConditions.Clear,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    4: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (20 - 10 + 1)) + 10,
      temperatureCelsius: Math.floor(Math.random() * (24 - 7 + 1)) + 7,
      uvIndex: Math.floor(Math.random() * (3 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.PartlyCloudy,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    5: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (30 - 10 + 1)) + 10,
      temperatureCelsius: Math.floor(Math.random() * (24 - 7 + 1)) + 7,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Overcast,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    6: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (60 - 30 + 1)) + 30,
      temperatureCelsius: Math.floor(Math.random() * (15 - 0 + 1)) + 0,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Fog,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    7: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (80 - 40 + 1)) + 40,
      temperatureCelsius: Math.floor(Math.random() * (24 - 12 + 1)) + 12,
      uvIndex: Math.floor(Math.random() * (3 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.RainWithSun,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    8: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (90 - 60 + 1)) + 60,
      temperatureCelsius: Math.floor(Math.random() * (22 - 8 + 1)) + 8,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Showers,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    9: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (100 - 80 + 1)) + 80,
      temperatureCelsius: Math.floor(Math.random() * (22 - 8 + 1)) + 8,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.HeavyRain,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    10: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (100 - 80 + 1)) + 80,
      temperatureCelsius: Math.floor(Math.random() * (22 - 8 + 1)) + 8,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Thunderstorm,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    11: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      temperatureCelsius: Math.floor(Math.random() * (5 - -3 + 1)) + -3,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Sleet,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
    12: {
      airQualityIndex: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      humidityPercent: Math.floor(Math.random() * (80 - 50 + 1)) + 50,
      precipitationProbabilityPercent:
        Math.floor(Math.random() * (100 - 80 + 1)) + 80,
      temperatureCelsius: Math.floor(Math.random() * (2 - -10 + 1)) + -10,
      uvIndex: Math.floor(Math.random() * (2 - 1 + 1)) + 1,
      weatherCondition: WeatherConditions.Snowy,
      windGustsKmh: Math.floor(Math.random() * (30 - 15 + 1)) + 15,
      windSpeedKmh: Math.floor(Math.random() * (22 - 5 + 1)) + 5,
    },
  };
}

export function generateLocationInserts() {
  const locationNames = [
    'athens-greece',
    'larissa-greece',
    'thessaloniki-greece',
    'tokyo-japan',
    'paris-france',
    'london-england',
    'stockholm-sweden',
    'amsterdam-netherlands',
    'berlin-germany',
    'rome-italy',
    'vienna-austria',
  ];

  const locations = locationNames.map((locationName) =>
    Object.assign(new Location(), { name: locationName })
  );
  return locations;
}
