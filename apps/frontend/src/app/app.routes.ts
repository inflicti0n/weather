import { Route } from '@angular/router';
import { OverlayComponent } from './modules/overlay/overlay.component';

export const appRoutes: Route[] = [
  // Landing route
  {
    path: '',
    component: OverlayComponent,
    /* children: [
      {
        path: 'landing',
        loadChildren: () => import('app/modules/landing/home/home.module').then((m) => m.LandingHomeModule),
      },
    ],*/
  },
];
