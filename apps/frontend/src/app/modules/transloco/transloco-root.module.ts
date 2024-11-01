import { isDevMode, NgModule } from '@angular/core';
import { provideTransloco, TranslocoModule } from '@ngneat/transloco';

import { TranslocoService } from './transloco-service';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'el'],
        defaultLang: 'en',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoService,
    }),
  ],
})
export class TranslocoRootModule {}
