import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { IconsModule } from './modules/icons/icons.module';
import { TranslocoRootModule } from './modules/transloco/transloco-root.module';
import { LayoutModule } from './modules/layout/layout.module';
import { LocationModule } from './modules/location/location.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    AngularSvgIconModule.forRoot(),
    IconsModule.forRoot(),
    TranslocoRootModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule,
    HttpClientModule,
    LocationModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
