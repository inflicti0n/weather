import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { LayoutComponent } from './layout.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AccessibilityDialogComponent } from './dialogs/accessibility/accessibility-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings/settings-dialog.component';

@NgModule({
  declarations: [
    LayoutComponent,
    AccessibilityDialogComponent,
    SettingsDialogComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  providers: [],
})
export class LayoutModule {}
