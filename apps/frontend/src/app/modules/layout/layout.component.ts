import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { LocationService } from '../../shared/services/location.service';

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

  constructor(
    private locationService: LocationService,
    private router: Router,
    private route: ActivatedRoute,
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
  }

  getBackgroundImageClass() {
    return `bg-[url(assets/backgrounds/sunny-1.png)] `;
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
