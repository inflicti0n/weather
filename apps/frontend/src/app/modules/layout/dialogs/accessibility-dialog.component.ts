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

import { AvailableLangs } from '@ngneat/transloco';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../../shared/services/theme.service';
import { PersistenceService } from '../../../shared/services/persistence.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { SettingsService } from '../../../shared/services/settings.service';

@Component({
  selector: 'weather-layout-component',
  templateUrl: './accessibility-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AccessibilityDialogComponent implements OnInit {
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
    private persistenceService: PersistenceService,
    private translationService: TranslationService,
    private settingsService: SettingsService,
    private dialogRef: MatDialogRef<AccessibilityDialogComponent>,
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

  onSelectLanguage(key: string) {
    this.translationService.setLanguage(key);
  }

  updateFont(fontClass: string) {
    this.settingsService.updateFont(fontClass);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
