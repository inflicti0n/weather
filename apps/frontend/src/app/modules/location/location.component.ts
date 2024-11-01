import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  getLocalTimeZone,
  now,
  parseAbsolute,
  toCalendarDateTime,
} from '@internationalized/date';

import { Location } from '../../shared/models/location';
import { locationTimezoneMap } from '../../shared/models/location-timezone-map';
import { Weather } from '../../shared/models/weather';
import { LocationService } from '../../shared/services/location.service';
import { TranslocoService } from '@ngneat/transloco';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'weather-location-component',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  currentIntervalId: number | null = null;
  time: Date = new Date(); // global variable for string interpolation on html
  centerSearchBar: boolean = true;

  searchInputControl = new UntypedFormControl();

  location: Location | null = null;
  currentTimezone: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private translocoService: TranslocoService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    console.log('Location Component Initialized');

    /*const locationId = this.route.snapshot.paramMap.get('location-id');
    if (locationId) {
      this.currentTimezone = locationTimezoneMap[locationId];
      this.getLocationHourlyWeather(locationId);
    }*/

    this.route.paramMap.subscribe((params: ParamMap) => {
      // Access individual route parameters using params.get('parameterName')
      const id = params.get('location-id');
      if (id) {
        this.currentTimezone = locationTimezoneMap[id];
        this.getLocationHourlyWeather(id);
      }
    });
  }

  private getLocationHourlyWeather(locationId: string) {
    let localTime = now(getLocalTimeZone());
    setTimeout;
    this.locationService
      .getLocationWeather(
        locationId,
        localTime.subtract({ hours: 1 }).toAbsoluteString(),
        localTime.add({ hours: 6 }).toAbsoluteString(),
      )
      .subscribe((result) => {
        this.location = result;
        if (this.currentTimezone) {
          this.initializeClock(this.currentTimezone);
        }
      });
  }

  initializeClock(timezone: string) {
    const convertedo = parseAbsolute(new Date().toISOString(), timezone);
    const heh = toCalendarDateTime(convertedo);

    this.time = new Date(heh.toString());

    if (this.currentIntervalId) {
      clearInterval(this.currentIntervalId);
    }

    this.currentIntervalId = window.setInterval(() => {
      const zonedDateTime = parseAbsolute(new Date().toISOString(), timezone);
      const calendarDateTime = toCalendarDateTime(zonedDateTime);

      this.time = new Date(calendarDateTime.toString());
    }, 1000);
  }

  getHighestLocationTemperature() {
    const temperatures = this.location?.weather.map(
      (weather: Weather) => weather.temperatureCelsius,
    );

    if (temperatures && temperatures.length > 0) {
      return Math.max(...temperatures);
    }
    return 0;
  }

  getLowestLocationTemperature() {
    const temperatures = this.location?.weather.map(
      (weather: Weather) => weather.temperatureCelsius,
    );

    if (temperatures && temperatures.length > 0) {
      return Math.min(...temperatures);
    }
    return 0;
  }

  getLocalTime(dateTime: Date) {
    if (this.currentTimezone) {
      const date = new Date(dateTime);

      const convertedo = parseAbsolute(
        date.toISOString(),
        this.currentTimezone,
      );
      const heh = toCalendarDateTime(convertedo);
      return new Date(heh.toString());
    }

    return;
  }

  getWeatherForecast() {
    const disruptiveConditions = [
      'thunderstorm',
      'showers',
      'heavy-rain',
      'snowy',
      'sleet',
    ];

    if (this.location) {
      const weather = [...this.location.weather];

      const disruptiveWeather = weather.find((weather: Weather) =>
        disruptiveConditions.includes(weather.weatherCondition),
      );

      if (!this.currentTimezone) {
        return;
      }

      if (disruptiveWeather) {
        const date = new Date(disruptiveWeather.dateTime);

        const convertedo = parseAbsolute(
          date.toISOString(),
          this.currentTimezone,
        );
        const heh = toCalendarDateTime(convertedo);

        return `${this.translocoService.translate(
          'location.forecast.' + disruptiveWeather?.weatherCondition,
        )} ${this.datePipe.transform(new Date(heh.toString()), 'h:mm a')}`;
      }

      const conditionOccurences = [
        { condition: 'clear', occurences: 0 },
        { condition: 'partly-cloudy', occurences: 0 },
        { condition: 'overcast', occurences: 0 },
        { condition: 'fog', occurences: 0 },
      ];

      weather.forEach((weather: Weather) => {
        const occurence = conditionOccurences.find(
          (conditionOccurence) =>
            conditionOccurence.condition === weather.weatherCondition,
        );
        if (occurence) {
          occurence.occurences++;
        }
      });

      const prevalentCondition = conditionOccurences.reduce((prev, current) => {
        return prev.occurences > current.occurences ? prev : current;
      });

      return `${this.translocoService.translate(
        'location.forecast.' + prevalentCondition.condition,
      )}`;
    }
    return;
  }

  getTimeAdjustedWeatherIconName(condition: string, hour: number) {
    if (
      hour > 5 &&
      hour < 21 &&
      ['clear', 'partly-cloudy'].includes(condition)
    ) {
      return condition === 'clear' ? 'sunny' : 'partly-sunny';
    }

    return condition;
  }
}
