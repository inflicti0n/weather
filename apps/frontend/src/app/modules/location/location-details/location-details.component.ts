import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  getLocalTimeZone,
  now,
  parseAbsolute,
  toCalendarDateTime,
} from '@internationalized/date';
import { TranslocoService } from '@ngneat/transloco';

import { Location } from '../../../shared/models/location';
import { locationTimezoneMap } from '../../../shared/models/location-timezone-map';
import { Weather } from '../../../shared/models/weather';
import { LocationService } from '../../../shared/services/location.service';

@Component({
  selector: 'weather-location-details-component',
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss',
})
export class LocationDetailsComponent implements OnInit {
  currentIntervalId: number | null = null;
  time: Date = new Date(); // global variable for string interpolation on html
  centerSearchBar: boolean = true;

  currentlySelectedWeather: Weather[] = [];

  currentlySelectedSingularWeather: Weather | null = null;

  searchInputControl = new UntypedFormControl();

  location: Location | null = null;

  currentMonthlyWeather: Record<string, Weather[]> = {};

  currentDayAveragedWeather: {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] = [];

  currentTimezone: string | null = null;

  dayAveragedWeather: {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private translocoService: TranslocoService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    console.log('Location Details Component Initialized');

    this.route.paramMap.subscribe((params: ParamMap) => {
      // Access individual route parameters using params.get('parameterName')
      const id = params.get('location-id');
      if (id) {
        this.currentTimezone = locationTimezoneMap[id];
        this.getLocationMonthlyWeather(id);
      }
    });
  }

  private getLocationMonthlyWeather(locationId: string) {
    console.log('getting ', locationId);
    const localTime = now(getLocalTimeZone());
    this.locationService
      .getLocationWeather(
        locationId,
        localTime.subtract({ hours: 1 }).toAbsoluteString(),
        localTime.add({ days: 29 }).set({ hour: 23 }).toAbsoluteString(),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.location = result;
        if (this.currentTimezone) {
          this.initializeClock(this.currentTimezone);
        }
        this.currentMonthlyWeather = this.getMonthlyWeather(result.weather);

        this.selectDayWeather(this.location.weather[0].dateTime);

        this.selectHourWeather(this.location.weather[0].dateTime);

        this.dayAveragedWeather = this.getDayAveragedWeather();
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
    const temperatures = this.currentlySelectedWeather.map(
      (weather: Weather) => weather.temperatureCelsius,
    );

    if (temperatures && temperatures.length > 0) {
      return Math.max(...temperatures);
    }
    return 0;
  }

  getLowestLocationTemperature() {
    const temperatures = this.currentlySelectedWeather.map(
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

        const zonedDateTime = parseAbsolute(
          date.toISOString(),
          this.currentTimezone,
        );
        const calendarDateTime = toCalendarDateTime(zonedDateTime);

        return `${this.translocoService.translate(
          'location.forecast.' + disruptiveWeather?.weatherCondition,
        )} ${this.datePipe.transform(new Date(calendarDateTime.toString()), 'h:mm a')}`;
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

  getTimeAdjustedWeatherIconName(condition: string, dateTime: Date) {
    const hour = this.getLocalTime(dateTime)?.getHours();

    if (
      hour &&
      hour > 5 &&
      hour < 21 &&
      ['clear', 'partly-cloudy'].includes(condition)
    ) {
      return condition === 'clear' ? 'sunny' : 'partly-sunny';
    }

    return condition;
  }

  getCompassArrowRotationClass(windDirection: string) {
    switch (windDirection) {
      case 'north':
        return 'rotate-0';
      case 'south':
        return 'rotate-180';
      case 'west':
        return '-rotate-90';
      case 'east':
        return 'rotate-90';
      case 'north-west':
        return '-rotate-45';
      case 'north-east':
        return 'rotate-45';
      case 'south-west':
        return 'rotate-[225deg]';
      case 'south-east':
        return 'rotate-[135deg';
      default:
        return 'rotate-0';
    }
  }

  getDayAveragedWeather(): {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] {
    const averagedDayWeather = Object.keys(this.currentMonthlyWeather).map(
      (key) => {
        const dayWeather = this.currentMonthlyWeather[key];

        const average = (array: number[]) =>
          array.reduce((p: number, c: number) => p + c, 0) / array.length;

        const averageTemperature = Math.ceil(
          average(
            dayWeather.map((weather: Weather) => weather.temperatureCelsius),
          ),
        );

        const prevalentCondition = this.getDayForecast(dayWeather);

        const adjustedHourDate = new Date(key);
        adjustedHourDate.setHours(6);
        return {
          dateTime: adjustedHourDate,
          temperatureCelsius: averageTemperature,
          weatherCondition: prevalentCondition ? prevalentCondition : '',
        };
      },
    );

    //console.log(averagedDayWeather);

    return averagedDayWeather;
    /*const dayWeather = weather.forEach((weather: Weather) => {
      const lol = this.datePipe.transform(
        new Date(weather.dateTime.toString()),
        'M-d-y',
      );
      const hoh = { lol: 'hjeh' };

      const date = new Date(weather.dateTime);
      daysWithWeathe;
      return;
    });

    const average = (array: number[]) =>
      array.reduce((p: number, c: number) => p + c, 0) / array.length;

    const averageTemperature = average(
      weather.map((weather: Weather) => weather.temperatureCelsius),
    );

    const prevalentCondition = this.getDayForecast(weather);*/
  }

  getDayForecast(dayWeather: Weather[]) {
    const disruptiveConditions = [
      'thunderstorm',
      'showers',
      'heavy-rain',
      'snowy',
      'sleet',
    ];

    if (dayWeather) {
      const weather = [...dayWeather];

      const disruptiveWeather = weather.find((weather: Weather) =>
        disruptiveConditions.includes(weather.weatherCondition),
      );

      if (!this.currentTimezone) {
        return;
      }

      if (disruptiveWeather) {
        return disruptiveWeather?.weatherCondition;
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

      return prevalentCondition.condition;
    }
    return;
  }

  selectDayWeather(dateTime: Date) {
    const dayDate = this.datePipe.transform(
      new Date(dateTime.toString()),
      'M-d-y',
    );

    if (!dayDate) {
      return;
    }

    this.currentlySelectedWeather = this.currentMonthlyWeather[dayDate];

    if (!this.currentlySelectedSingularWeather?.dateTime) {
      return;
    }

    this.selectHourWeather(this.currentlySelectedWeather[0].dateTime);
  }

  selectHourWeather(dateTime: Date) {
    const dayDate = this.datePipe.transform(
      new Date(dateTime.toString()),
      'M-d-y',
    );

    if (!dayDate) {
      return;
    }

    this.currentlySelectedWeather = this.currentMonthlyWeather[dayDate];

    const hourWeather = this.currentlySelectedWeather.find(
      (weather: Weather) => {
        const dayAndHour = this.datePipe.transform(
          new Date(dateTime.toString()),
          'short',
        );
        console.log(dayAndHour);
        if (
          dayAndHour ===
          this.datePipe.transform(
            new Date(weather.dateTime.toString()),
            'short',
          )
        ) {
          return true;
        }
        return false;
      },
    );

    if (!hourWeather) return;

    this.currentlySelectedSingularWeather = hourWeather;
  }

  getMonthlyWeather(weather: Weather[]) {
    const daysWithWeather: Record<string, Weather[]> = {};

    const dates = weather.map((weather: Weather) =>
      this.datePipe.transform(new Date(weather.dateTime.toString()), 'M-d-y'),
    );

    if (!dates) {
      return daysWithWeather;
    }

    const uniqueDates = new Set(dates);
    uniqueDates.forEach((date) => {
      if (!date) {
        return;
      }
      daysWithWeather[date] = [];
    });

    weather.forEach((weather: Weather) => {
      const dateKey = this.datePipe.transform(
        new Date(weather.dateTime.toString()),
        'M-d-y',
      );

      if (!dateKey || dateKey === null) {
        return;
      }

      daysWithWeather[dateKey].push(weather);
    });

    return daysWithWeather;
  }

  getAirQualityIndexSliderClass(aqi: number): string {
    if (!aqi) {
      return '';
    }

    (val: number, max: number, min: number) => (val - min) / (max - min);

    console.log(`left-[${aqi / 13}rem]`);
    //return 5;
    const heh = aqi / 13;
    const slideAmount = 'left-[' + heh.toString() + 'rem]';
    console.log(slideAmount);
    return slideAmount;
  }
}
