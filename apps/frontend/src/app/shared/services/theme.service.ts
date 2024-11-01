import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Location } from '../models/location';
import {
  getLocalTimeZone,
  now,
  parseAbsolute,
  toCalendarDateTime,
} from '@internationalized/date';
import { Weather } from '../models/weather';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentLocationWeatherCondition: BehaviorSubject<string> =
    new BehaviorSubject('sunny-1');

  useLightFont: boolean = true;

  constructor(private httpClient: HttpClient) {}

  updateTheme(weather: Weather, timezone: string) {
    const hour = this.getLocalTime(weather.dateTime, timezone)?.getHours();

    if (hour && hour > 5 && hour < 21) {
      if (['clear', 'partly-cloudy'].includes(weather.weatherCondition)) {
        const condition =
          weather.weatherCondition === 'clear' ? 'sunny' : 'partly-sunny';
        this.currentLocationWeatherCondition.next(
          `${condition}-${Math.floor(Math.random() * 2)}`,
        );
      } else if (
        [
          'fog',
          'snowy',
          'thunderstorm',
          'overcast',
          'showers',
          'heavy-rain',
        ].includes(weather.weatherCondition)
      ) {
        this.currentLocationWeatherCondition.next(
          `${weather.weatherCondition}-day-${Math.floor(Math.random() * 2)}`,
        );
      }

      return;
    }

    this.currentLocationWeatherCondition.next(
      `${weather.weatherCondition}-night-${Math.floor(Math.random() * 2)}`,
    );
  }
  getLocalTime(dateTime: Date, timezone: string) {
    if (timezone) {
      const date = new Date(dateTime);

      const convertedo = parseAbsolute(date.toISOString(), timezone);
      const heh = toCalendarDateTime(convertedo);
      return new Date(heh.toString());
    }

    return;
  }
}
