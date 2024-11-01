import { NgModule } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';

@NgModule()
export class IconsModule {
  constructor(private iconReg: SvgIconRegistryService) {
    this.registerIcons();
  }

  registerIcons() {
    this.iconReg
      ?.loadSvg('assets/icons/accessibility.svg', 'accessibility')
      ?.subscribe();
  }
}
