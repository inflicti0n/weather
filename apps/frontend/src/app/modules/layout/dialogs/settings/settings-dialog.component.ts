import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { PersistenceService } from '../../../../shared/services/persistence.service';
import { SettingsService } from '../../../../shared/services/settings.service';
import { ThemeService } from '../../../../shared/services/theme.service';
import { TranslationService } from '../../../../shared/services/translation.service';

@Component({
  templateUrl: './settings-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsDialogComponent implements OnInit {
  centerSearchBar: boolean = true;

  locationResults: string[] = [];

  showSearchResults: boolean = false;

  searchInputControl = new UntypedFormControl();

  currentBackgroundImageClass: string = 'sunny-1';

  currentBackgroundDaytime: 'day' | 'night' = 'day';

  currentFontColorClass: string = 'text-white';

  currentRecentLocationIds: string[] = [];

  isCountrySelectOpen: boolean = false;

  currentTranslationKey: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private translationService: TranslationService,
    private settingsService: SettingsService,
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
  ) {}

  ngOnInit(): void {
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
  }

  getCurrentTemperatureUnits() {
    return this.settingsService.currentTemperatureUnits$.value;
  }

  getCurrentSpeedUnits() {
    return this.settingsService.currentSpeedUnits$.value;
  }

  getCurrentTimeFormat() {
    return this.settingsService.currentTimeFormat$.value;
  }

  getCurrentTheme() {
    return this.settingsService.currentTheme$.value;
  }

  updateTemperatureUnits(units: string) {
    this.settingsService.updateTemperatureUnits(units);
  }

  updateSpeedUnits(units: string) {
    this.settingsService.updateSpeedUnits(units);
  }

  updateTimeFormat(format: number) {
    this.settingsService.updateTimeFormat(format);
  }

  updateTheme(theme: string) {
    this.settingsService.updateTheme(theme);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
