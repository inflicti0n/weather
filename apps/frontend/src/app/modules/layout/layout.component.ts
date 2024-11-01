import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, of, switchMap } from 'rxjs';

import { LocationService } from '../../shared/services/location.service';
import { Weather } from '../../shared/models/weather';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'weather-layout-component',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  centerSearchBar: boolean = true;

  locationResults: string[] = [];

  showSearchResults: boolean = false;

  searchInputControl = new UntypedFormControl();

  currentBackgroundImageClass: string = 'sunny-1';

  constructor(
    private locationService: LocationService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.searchInputControl.valueChanges.subscribe((query) => {
      this.searchForLocations(query);
    });

    //Check if user has navigated to a child route and move the search bar accordingly
    this.router.events
      .pipe(switchMap(() => of(this.route.children.length > 0)))
      .subscribe((result) => {
        this.centerSearchBar = result ? false : true;
      });

    this.themeService.currentLocationWeatherCondition.subscribe((condition) => {
      this.currentBackgroundImageClass = condition;
    });
  }

  getBackgroundImageClass() {
    return {
      'background-image':
        "url('../../assets/backgrounds/" +
        this.currentBackgroundImageClass +
        ".png')",
    };
  }

  viewLocation(locationId: string) {
    this.router.navigate(['/', locationId]);
    this.searchInputControl.setValue('');
  }

  preventEvent(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  private searchForLocations(query: string) {
    this.locationService
      .getLocations(query)
      .subscribe((result) => (this.locationResults = result));
  }
}
