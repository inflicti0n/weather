import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  currentFont$ = new BehaviorSubject('comfortaa'); //atkinson-hyperlegible  ,  opendyslexic
  currentContrast$ = new BehaviorSubject('default'); //high
  currentTemperatureUnits$ = new BehaviorSubject('celsius'); //fahrenheit
  currentSpeedUnits$ = new BehaviorSubject('kilometers'); //miles
  currentTimeFormat$ = new BehaviorSubject(24); // 12
  currentWeatherIconCollection$ = new BehaviorSubject('solid'); //outline
  currentTheme$ = new BehaviorSubject('default'); // iridescent, leafy

  constructor(
    private httpClient: HttpClient,
    private persistenceService: PersistenceService,
  ) {
    //Get Current Font from Local Storage
    this.persistenceService.currentFont$.subscribe((currentFont: any) => {
      if (currentFont) {
        this.updateFont(currentFont);
      }
    });

    //Get Current Contrast from Local Storage
    this.persistenceService.currentContrast$.subscribe(
      (currentContrast: any) => {
        if (currentContrast) {
          this.updateContrast(currentContrast);
        }
      },
    );

    //Get Current Temperature Units from Local Storage
    this.persistenceService.currentTemperatureUnits$.subscribe(
      (currentTemperatureUnits: any) => {
        if (currentTemperatureUnits) {
          this.updateTemperatureUnits(currentTemperatureUnits);
        }
      },
    );

    //Get Current Speed Units from Local Storage
    this.persistenceService.currentSpeedUnits$.subscribe(
      (currentSpeedUnits: any) => {
        if (currentSpeedUnits) {
          this.updateSpeedUnits(currentSpeedUnits);
        }
      },
    );

    //Get Current Time Format from Local Storage
    this.persistenceService.currentTimeFormat$.subscribe(
      (currentTimeFormat: any) => {
        if (currentTimeFormat) {
          this.updateTimeFormat(currentTimeFormat);
        }
      },
    );

    //Get Current Weather Icon Collection from Local Storage
    this.persistenceService.weatherIconCollection$.subscribe(
      (weatherIconCollection: any) => {
        if (weatherIconCollection) {
          this.updateWeatherIconCollection(weatherIconCollection);
        }
      },
    );

    //Get Current Theme from Local Storage
    this.persistenceService.theme$.subscribe((theme: any) => {
      if (theme) {
        this.updateTheme(theme);
      }
    });
  }

  updateFont(fontName: string) {
    this.currentFont$.next(fontName);
    this.persistenceService.setFont(fontName);
  }

  updateContrast(contrast: string) {
    this.currentContrast$.next(contrast);
    this.persistenceService.setContrast(contrast);
  }

  updateTemperatureUnits(units: string) {
    this.currentTemperatureUnits$.next(units);
    this.persistenceService.setTemperatureUnits(units);
  }

  updateSpeedUnits(units: string) {
    this.currentSpeedUnits$.next(units);
    this.persistenceService.setSpeedUnits(units);
  }

  updateTimeFormat(format: number) {
    this.currentTimeFormat$.next(format);
    this.persistenceService.setTimeFormat(format);
  }

  updateWeatherIconCollection(collection: string) {
    this.currentWeatherIconCollection$.next(collection);
    this.persistenceService.setWeatherIconCollection(collection);
  }

  updateTheme(theme: string) {
    this.currentTheme$.next(theme);
    this.persistenceService.setTheme(theme);
  }
}
