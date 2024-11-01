import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  getLocations(query: string) {
    return this.httpClient
      .get(`/backend/location?search=${query}`)
      .pipe(tap((locations) => console.log('Got locations : ' + locations)));
  }
}
