import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { SharedModule } from './modules/shared/shared.module';
import { CoreModule } from './modules/core/core.module';
import { RouterModule } from '@angular/router';
import { OverlayModule } from './modules/overlay/overlay.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    AngularSvgIconModule.forRoot(),
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    OverlayModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
