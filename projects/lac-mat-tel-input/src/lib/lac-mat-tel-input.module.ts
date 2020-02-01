import { NgModule } from '@angular/core';
import { LacMatTelInputComponent } from './lac-mat-tel-input.component';
import { MatMenuModule, MatDividerModule, MatButtonModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LacMatCountrySelectorComponent } from './lac-mat-country-selector/lac-mat-country-selector.component';

@NgModule({
  declarations: [LacMatTelInputComponent, LacMatCountrySelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [LacMatTelInputComponent, LacMatCountrySelectorComponent]
})
export class LacMatTelInputModule { }
