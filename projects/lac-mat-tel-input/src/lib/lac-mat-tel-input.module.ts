import { NgModule } from '@angular/core';
import { LacMatTelInputComponent } from './lac-mat-tel-input.component';
import { MatMenuModule, MatDividerModule, MatButtonModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LacMatTelInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [LacMatTelInputComponent]
})
export class LacMatTelInputModule { }
