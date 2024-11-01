import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  recentLocations$ = new BehaviorSubject<string[]>([]);
  activeLanguage$ = new BehaviorSubject(null);
  currentFont$ = new BehaviorSubject(null);
  currentContrast$ = new BehaviorSubject(null);
  currentTemperatureUnits$ = new BehaviorSubject(null);
  currentSpeedUnits$ = new BehaviorSubject(null);
  currentTimeFormat$ = new BehaviorSubject(null);
  weatherIconCollection$ = new BehaviorSubject(null);
  theme$ = new BehaviorSubject(null);

  constructor(private storage: StorageMap) {
    //Initialize Recent Locations
    this.storage.get('locations').subscribe((locations: any) => {
      if (locations && locations.length > 1) {
        this.recentLocations$.next(locations);
      }
    });

    //Initialize Active Language
    this.storage.get('activeLanguage').subscribe((languageKey: any) => {
      if (languageKey) {
        this.activeLanguage$.next(languageKey);
      }
    });

    //Initialize Font
    this.storage.get('font').subscribe((font: any) => {
      if (font) {
        this.currentFont$.next(font);
      }
    });

    //Initialize Contrast
    this.storage.get('contrast').subscribe((contrast: any) => {
      if (contrast) {
        this.currentContrast$.next(contrast);
      }
    });

    //Initialize Temperature Units
    this.storage.get('temperatureUnits').subscribe((temperatureUnits: any) => {
      if (temperatureUnits) {
        this.currentTemperatureUnits$.next(temperatureUnits);
      }
    });

    //Initialize Speed Units
    this.storage.get('speedUnits').subscribe((speedUnits: any) => {
      if (speedUnits) {
        this.currentSpeedUnits$.next(speedUnits);
      }
    });

    //Initialize Time Format
    this.storage.get('timeFormat').subscribe((timeFormat: any) => {
      if (timeFormat) {
        this.currentTimeFormat$.next(timeFormat);
      }
    });

    //Initialize Weather Icon Collection
    this.storage
      .get('weatherIconCollection')
      .subscribe((weatherIconCollection: any) => {
        if (weatherIconCollection) {
          this.weatherIconCollection$.next(weatherIconCollection);
        }
      });

    //Initialize Theme
    this.storage.get('theme').subscribe((theme: any) => {
      if (theme) {
        this.theme$.next(theme);
      }
    });
  }

  addRecentLocation(locationId: string) {
    this.storage.get('locations').subscribe((locations: any) => {
      let locationsToSet = new Set<string>(locations);
      locationsToSet.add(locationId);
      const locationArray = [...locationsToSet];
      if (locationArray.length > 2) {
        locationArray.shift();
      }

      this.storage.set('locations', locationArray).subscribe(() => {});

      this.recentLocations$.next(locationArray);
    });
  }

  setActiveLanguage(languageKey: string) {
    this.storage.set('activeLanguage', languageKey).subscribe(() => {});
  }

  setFont(font: string) {
    this.storage.set('font', font).subscribe(() => {});
  }
  setContrast(contrast: string) {
    this.storage.set('contrast', contrast).subscribe(() => {});
  }
  setTemperatureUnits(temperatureUnits: string) {
    this.storage.set('temperatureUnits', temperatureUnits).subscribe(() => {});
  }
  setSpeedUnits(speedUnits: string) {
    this.storage.set('speedUnits', speedUnits).subscribe(() => {});
  }
  setTimeFormat(timeFormat: number) {
    this.storage.set('timeFormat', timeFormat).subscribe(() => {});
  }
  setWeatherIconCollection(weatherIconCollection: string) {
    this.storage
      .set('weatherIconCollection', weatherIconCollection)
      .subscribe(() => {});
  }
  setTheme(theme: string) {
    this.storage.set('theme', theme).subscribe(() => {});
  }
}
