import { Route } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { LocationComponent } from './modules/location/location.component';

export const appRoutes: Route[] = [
  // Landing route
  {
    path: '',
    title: 'weather',
    component: LayoutComponent,
    children: [
      {
        path: ':location-name',
        component: LocationComponent,
      },
    ],
  },
  { path: '**', component: LayoutComponent },
];
