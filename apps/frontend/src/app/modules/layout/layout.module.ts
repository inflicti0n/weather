import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { LayoutComponent } from './layout.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AccessibilityDialogComponent } from './dialogs/accessibility-dialog.component';

@NgModule({
  declarations: [LayoutComponent, AccessibilityDialogComponent],
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
