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

  private fontColors = { light: 'text-white', dark: 'text-sky-950' };

  fontColorClass$: BehaviorSubject<string> = new BehaviorSubject(
    this.fontColors.light,
  );

  private backgroundFontColorMap: Record<string, string> = {
    'clear-night-0': this.fontColors.light,
    'clear-night-1': this.fontColors.light,
    'fog-day-0': this.fontColors.dark,
    'fog-day-1': this.fontColors.dark,
    'fog-night-0': this.fontColors.light,
    'fog-night-1': this.fontColors.light,
    'heavy-rain-day-0': this.fontColors.light,
    'heavy-rain-day-1': this.fontColors.light,
    'heavy-rain-night-0': this.fontColors.light,
    'heavy-rain-night-1': this.fontColors.light,
    'overcast-day-0': this.fontColors.dark,
    'overcast-day-1': this.fontColors.dark,
    'overcast-night-0': this.fontColors.dark,
    'overcast-night-1': this.fontColors.dark,
    'partly-cloudy-0': this.fontColors.light,
    'partly-cloudy-1': this.fontColors.light,
    'partly-sunny-0': this.fontColors.dark,
    'partly-sunny-1': this.fontColors.dark,
    'showers-day-0': this.fontColors.light,
    'showers-day-1': this.fontColors.light,
    'showers-night-0': this.fontColors.light,
    'showers-night-1': this.fontColors.light,
    'sleet-day-0': this.fontColors.light,
    'sleet-day-1': this.fontColors.light,
    'sleet-night-0': this.fontColors.light,
    'sleet-night-1': this.fontColors.light,
    'snowy-day-0': this.fontColors.dark,
    'snowy-day-1': this.fontColors.dark,
    'snowy-night-0': this.fontColors.light,
    'snowy-night-1': this.fontColors.light,
    'sunny-0': this.fontColors.dark,
    'sunny-1': this.fontColors.dark,
    'thunderstorm-day-0': this.fontColors.dark,
    'thunderstorm-day-1': this.fontColors.light,
    'thunderstorm-night-0': this.fontColors.light,
    'thunderstorm-night-1': this.fontColors.light,
  };

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
    } else {
      this.currentLocationWeatherCondition.next(
        `${weather.weatherCondition}-night-${Math.floor(Math.random() * 2)}`,
      );
    }

    this.fontColorClass$.next(
      this.backgroundFontColorMap[this.currentLocationWeatherCondition.value],
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
