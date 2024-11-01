import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

import { LocationService } from '../../shared/services/location.service';
import { Weather } from '../../shared/models/weather';
import { ThemeService } from '../../shared/services/theme.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { TranslocoService } from '../transloco/transloco-service';
import { AvailableLangs } from '@ngneat/transloco';
import { TranslationService } from '../../shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { AccessibilityDialogComponent } from './dialogs/accessibility/accessibility-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings/settings-dialog.component';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'weather-layout-component',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  centerSearchBar: boolean = true;

  locationResults: string[] = [];

  showSearchResults: boolean = false;

  searchInputControl = new UntypedFormControl();

  currentBackgroundImageClass: string = 'sunny-1';

  currentBackgroundDaytime: 'day' | 'night' = 'day';

  currentFontColorClass: string = 'text-white';

  currentRecentLocationIds: string[] = [];

  isCountrySelectOpen: boolean = false;

  availableTranslationKeys: string[];

  currentTranslationKey: any;

  currentTheme: string = 'default';

  currentContrast: string = 'default';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private locationService: LocationService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private persistenceService: PersistenceService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private settingsService: SettingsService,
  ) {
    this.availableTranslationKeys =
      this.translationService.getAvailableLanguageKeys() as string[];

    this.translationService.activeLanguageKey
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((key) => {
        this.currentTranslationKey = key;
        console.log(this.currentTranslationKey);
      });

    this.settingsService.currentTheme$.subscribe((theme: string) => {
      this.currentTheme = theme;
    });

    this.settingsService.currentContrast$.subscribe((contrast: string) => {
      this.currentContrast = contrast;
    });
  }

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
      if (condition.includes('day') || condition.includes('sunny')) {
        this.currentBackgroundDaytime = 'day';
      } else {
        this.currentBackgroundDaytime = 'night';
      }
      this.currentBackgroundImageClass = condition;
    });

    this.themeService.fontColorClass$.subscribe((fontColor: string) => {
      this.currentFontColorClass = fontColor;
    });

    this.persistenceService.recentLocations$.subscribe(
      (locations) => (this.currentRecentLocationIds = locations),
    );
  }

  getBackgroundImageClass() {
    return {
      'background-image':
        "url('../../assets/backgrounds/" +
        this.currentBackgroundImageClass +
        ".jpg')",
    };
  }

  viewLocation(locationId: string) {
    this.persistenceService.addRecentLocation(locationId);
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

  onSelectLanguage(key: string) {
    this.translationService.setLanguage(key);
  }

  openAccessibilityDialog() {
    this.dialog.open(AccessibilityDialogComponent, {
      panelClass: [
        'w-[100vw]',
        'h-[80vh]',
        'lg:w-2/3',
        'lg:h-2/4',
        'xl:w-2/4',
        '2xl:w-1/3',
        '2xl:h-1/3',
        'rounded-full',
      ],
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent, {
      panelClass: [
        'w-[100vw]',
        'h-[90vh]',
        'sm:h-[80vh]',
        'lg:w-2/3',
        'lg:h-4/6',
        'xl:w-2/4',
        '2xl:w-1/3',
        '2xl:h-2/4',
        'rounded-full',
      ],
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
