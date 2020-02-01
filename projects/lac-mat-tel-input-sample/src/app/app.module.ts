import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatDividerModule} from '@angular/material';

import { AppComponent } from './app.component';
import { LacMatTelInputModule } from 'projects/lac-mat-tel-input/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LacMatTelInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
