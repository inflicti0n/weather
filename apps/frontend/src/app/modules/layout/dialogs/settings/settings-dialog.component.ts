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
    private persistenceService: PersistenceService,
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

  getCurrentFont() {
    return this.settingsService.currentFont$.value;
  }

  updateContrast(contrast: string) {
    this.settingsService.updateContrast(contrast);
  }

  getCurrentContrast() {
    return this.settingsService.currentContrast$.value;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
