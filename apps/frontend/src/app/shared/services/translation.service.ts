import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { PersistenceService } from './persistence.service';
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  activeLanguageKey = new BehaviorSubject('en');

  constructor(
    private translocoService: TranslocoService,
    private persistenceService: PersistenceService,
  ) {
    //Get Active Language from Local Storage
    this.persistenceService.activeLanguage.subscribe((languageKey: any) => {
      if (languageKey) {
        this.setLanguage(languageKey);
      }
    });
  }

  getAvailableLanguageKeys() {
    return this.translocoService.getAvailableLangs();
  }

  getCurrentLanguageKey() {
    return this.translocoService.getActiveLang();
  }

  public setLanguage(key: string) {
    this.translocoService.setActiveLang(key);
    this.persistenceService.setActiveLanguage(key);
    this.activeLanguageKey.next(key);
  }
}
