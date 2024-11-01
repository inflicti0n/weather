import { Route } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { LocationComponent } from './modules/location/location.component';
import { LocationDetailsComponent } from './modules/location/location-details/location-details.component';

export const appRoutes: Route[] = [
  // Landing route
  {
    path: '',
    title: 'weather',
    component: LayoutComponent,
    children: [
      {
        path: ':location-id',
        component: LocationComponent,
        children: [
          {
            path: 'details',
            component: LocationDetailsComponent,
          },
        ],
      },
    ],
  },
  { path: '**', component: LayoutComponent },
];
