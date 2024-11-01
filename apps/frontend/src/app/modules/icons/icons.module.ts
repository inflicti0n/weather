import { ModuleWithProviders, NgModule } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';

@NgModule()
export class IconsModule {
  constructor(private iconReg: SvgIconRegistryService) {
    console.log('Registering icons');
    this.registerIcons();
  }

  registerIcons() {
    this.iconReg
      ?.loadSvg('assets/icons/accessibility.svg', 'accessibility')
      ?.subscribe();

    this.iconReg?.loadSvg('assets/icons/sunny.svg', 'sunny')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/overcast.svg', 'overcast')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/clear.svg', 'clear')?.subscribe();
    this.iconReg
      ?.loadSvg('assets/icons/partly-sunny.svg', 'partly-sunny')
      ?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/partly-cloudy.svg', 'partly-cloudy')
      ?.subscribe();

    this.iconReg?.loadSvg('assets/icons/fog.svg', 'fog')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/snowy.svg', 'snowy')?.subscribe();
    this.iconReg
      ?.loadSvg('assets/icons/precipitation.svg', 'precipitation')
      ?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/air-quality-index.svg', 'air-quality-index')
      ?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/compass-arrow.svg', 'compass-arrow')
      ?.subscribe();

    this.iconReg?.loadSvg('assets/icons/uv-index.svg', 'uv-index')?.subscribe();

    this.iconReg?.loadSvg('assets/icons/wind.svg', 'wind')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/gusts.svg', 'gusts')?.subscribe();

    this.iconReg?.loadSvg('assets/icons/humidity.svg', 'humidity')?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/heavy-rain.svg', 'heavy-rain')
      ?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/thunderstorm.svg', 'thunderstorm')
      ?.subscribe();
    this.iconReg?.loadSvg('assets/icons/sleet.svg', 'sleet')?.subscribe();

    this.iconReg?.loadSvg('assets/icons/graph.svg', 'graph')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/list.svg', 'list')?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/arrow-left.svg', 'arrow-left')
      ?.subscribe();
    this.iconReg?.addSvg(
      'arrow-down',
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
    `,
    );
    this.iconReg?.loadSvg('assets/icons/chart.svg', 'chart')?.subscribe();

    this.iconReg?.loadSvg('assets/icons/location.svg', 'location')?.subscribe();
    this.iconReg?.loadSvg('assets/icons/uk-flag.svg', 'uk-flag')?.subscribe();

    this.iconReg
      ?.loadSvg('assets/icons/greece-flag.svg', 'greece-flag')
      ?.subscribe();

    this.iconReg.addSvg(
      'showers',
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18.707" viewBox="0 0 20 18.707">
    <path id="Path_39" data-name="Path 39" d="M16.985,12.968H5.661A4.663,4.663,0,1,1,6.72,3.763a4.663,4.663,0,0,1,8.933,1.445,4,4,0,1,1,1.332,7.76Zm-14.848,3.8L3.469,15.44a.669.669,0,0,0-.946-.946L1.191,15.826a.669.669,0,1,0,.946.946ZM3.664,19.4a.666.666,0,0,1-.473-1.139l1.565-1.525a.666.666,0,0,1,.939.939L4.137,19.208A.666.666,0,0,1,3.664,19.4Zm4.784-1.427a.666.666,0,0,1-.473-1.139L9.86,14.95a.669.669,0,1,1,.946.946L8.921,17.781A.666.666,0,0,1,8.448,17.974Zm3.46,1.471L14.43,16.86a.669.669,0,1,0-.946-.946L10.962,18.5a.669.669,0,1,0,.946.946Zm5.017-1.338a.666.666,0,0,1-.473-1.139l1.885-1.885a.669.669,0,0,1,.946.946L17.4,17.915A.666.666,0,0,1,16.925,18.108Z" transform="translate(-0.994 -0.936)" fill="currentColor"/>
  </svg>
  `,
    );

    this.iconReg?.addSvg(
      'magnifying-glass',
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    `,
    );

    this.iconReg?.addSvg(
      'cog',
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
    </svg>
    `,
    );
  }

  static forRoot(): ModuleWithProviders<IconsModule> {
    return {
      ngModule: IconsModule,
    };
  }
}
