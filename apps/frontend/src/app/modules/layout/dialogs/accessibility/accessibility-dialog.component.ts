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

  currentTheme: string = 'default';

  private unsubscribeAll: Subject<any> = new Subject<any>();

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
    this.themeService.fontColorClass$.subscribe((fontColor: string) => {
      this.currentFontColorClass = fontColor;
    });

    this.settingsService.currentTheme$.subscribe((theme: string) => {
      this.currentTheme = theme;
    });
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
