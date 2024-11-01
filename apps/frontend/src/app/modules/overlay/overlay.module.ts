import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OverlayComponent } from './overlay.component';

@NgModule({
  declarations: [OverlayComponent],
  imports: [SharedModule],
  providers: [],
})
export class OverlayModule {}
