import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
    TranslocoModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
    TranslocoModule,
    MatTooltipModule,
  ],
  providers: [MatIconRegistry, DatePipe],
})
export class SharedModule {}
