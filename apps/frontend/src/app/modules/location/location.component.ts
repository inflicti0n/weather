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
import { LocationService } from '../../shared/services/location.service';
import { Weather } from '../../shared/models/weather';

@Component({
  selector: 'weather-location-component',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  //absoluteDateTime = new Date().toI
  time: Date = new Date(); // global variable for string interpolation on html
  centerSearchBar: boolean = true;

  searchInputControl = new UntypedFormControl();

  location: Location | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    console.log('Location Component Initialized');

    this.route.paramMap.subscribe((params: ParamMap) => {
      // Access individual route parameters using params.get('parameterName')
      const id = params.get('location-id');
      console.log('ID:', id);
      if (id) {
        this.getLocationHourlyWeather(id);
      }
    });
  }

  private getLocationHourlyWeather(locationId: string) {
    let localTime = now(getLocalTimeZone());
    console.log(localTime.subtract({ hours: 1 }));
    console.log(localTime.add({ hours: 6 }));

    this.locationService
      .getLocationWeather(
        locationId,
        localTime.subtract({ hours: 1 }).toAbsoluteString(),
        localTime.add({ hours: 6 }).toAbsoluteString(),
      )
      .subscribe((result) => {
        this.location = result;
        this.initializeClock();
      });

    //console.log(parseAbsoluteToLocal());
  }

  initializeClock() {
    setInterval(() => {
      const convertedo = parseAbsolute(
        new Date().toISOString(),
        'Europe/Athens',
      );
      const heh = toCalendarDateTime(convertedo);

      this.time = new Date(heh.toString()); //set time variable with current date
    }, 1000); // set it every one seconds
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
    const date = new Date(dateTime);

    const convertedo = parseAbsolute(date.toISOString(), 'Europe/Athens');
    const heh = toCalendarDateTime(convertedo);
    return new Date(heh.toString());
  }

  getWeatherForecast() {
    /*if(this.location){
      let weather = [...this.location.weather];
      weather.splice(0,1);
      weather.filter((weather:Weather)=>weather.)
    }*/
  }
}
