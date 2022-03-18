import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComposantRoutingModule } from './composant-routing.module';
import { ComposantComponent } from './composant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from 'mat-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';

import {MatSelectModule} from '@angular/material/select';
   
 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
 @NgModule({
  declarations: [ComposantComponent],
  imports: [
    CommonModule,
    ComposantRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatKeyboardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule
  ]
})
export class ComposantModule { }
