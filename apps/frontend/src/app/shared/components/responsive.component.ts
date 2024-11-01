import { Component, HostListener } from '@angular/core';

import { ResponsiveService } from '../services/responsive.service';

@Component({
  selector: 'responsive-component',
  templateUrl: './responsive.component.html',
  standalone: true,
})
export class ResponsiveComponent {
  screenWidth: any;
  screenHeight: any;

  @HostListener('window:resize', [])
  private onResize() {
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.responsiveService.onResize(this.screenWidth);
  }

  constructor(private responsiveService: ResponsiveService) {}
}
