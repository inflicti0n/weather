import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResponsiveComponent } from './components/responsive.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
    TranslocoModule,
    MatTooltipModule,
    ResponsiveComponent,
  ],
  exports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
    TranslocoModule,
    MatTooltipModule,
    ResponsiveComponent,
  ],
  providers: [MatIconRegistry, DatePipe],
})
export class SharedModule {}
