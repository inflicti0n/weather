import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { isDevMode, NgModule } from '@angular/core';
import { TranslocoService } from './transloco-service';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'el'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoService,
    }),
  ],
})
export class TranslocoRootModule {}
