import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
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
  ],
  exports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
    TranslocoModule,
  ],
  providers: [MatIconRegistry],
})
export class SharedModule {}
