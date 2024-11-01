import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  getLocations(query: string): Observable<string[]> {
    return this.httpClient
      .get<string[]>(`/backend/location?search=${query}`)
      .pipe(tap((locations) => console.log('Got locations : ', locations)));
  }

  getLocationWeather(
    locationId: string,
    startTimeIsoString: string,
    endTimeIsoString?: string,
  ) {
    return this.httpClient
      .get<Location>(
        `/backend/location/${locationId}/weather?startTime=${startTimeIsoString}&${endTimeIsoString ? 'endTime=' + endTimeIsoString : ''}`,
      )
      .pipe(
        tap((location) => console.log('Got location weather : ', location)),
      );
  }
}
