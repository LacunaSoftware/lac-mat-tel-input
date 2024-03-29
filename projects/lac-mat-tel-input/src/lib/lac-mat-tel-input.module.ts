import { NgModule } from '@angular/core';
import { LacMatTelInputComponent } from './lac-mat-tel-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LacMatCountrySelectorComponent } from './lac-mat-country-selector/lac-mat-country-selector.component';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [LacMatTelInputComponent, LacMatCountrySelectorComponent, SearchPipe],
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
