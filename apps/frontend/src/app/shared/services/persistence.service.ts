import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  recentLocations = new BehaviorSubject<string[]>([]);
  activeLanguage = new BehaviorSubject(null);

  constructor(private storage: StorageMap) {
    //Initialize Recent Locations
    this.storage.get('locations').subscribe((locations: any) => {
      if (locations && locations.length > 1) {
        this.recentLocations.next(locations);
      }
    });

    //Initialize Active Language
    this.storage.get('activeLanguage').subscribe((languageKey: any) => {
      if (languageKey) {
        this.activeLanguage.next(languageKey);
      }
    });
  }

  addRecentLocation(locationId: string) {
    let locationsToSet: string[] = [];

    this.storage.get('locations').subscribe((locations: any) => {
      if (locations && locations.length > 1) {
        locationsToSet.push(locations[1]);
      } else if (locations && locations.length > 0) {
        locationsToSet.push(locations[0]);
      }
      locationsToSet.push(locationId);

      this.storage.set('locations', locationsToSet).subscribe((result) => {});

      this.recentLocations.next(locationsToSet);
    });
  }

  setActiveLanguage(languageKey: string) {
    this.storage.set('activeLanguage', languageKey).subscribe(() => {});
  }
}
