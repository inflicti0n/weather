import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
  ],
  exports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    AngularSvgIconModule,
  ],
  providers: [MatIconRegistry],
})
export class SharedModule {}
