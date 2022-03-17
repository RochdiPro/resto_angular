import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategorieRoutingModule } from './categorie-routing.module';
import { CategorieComponent } from './categorie.component';
import { ReactiveFormsModule } from '@angular/forms';
 import { HttpClientModule } from '@angular/common/http';
 import { MatFormFieldModule } from '@angular/material/form-field';
 import { MatInputModule } from '@angular/material/input';

 @NgModule({
  declarations: [CategorieComponent],
  imports: [
    CommonModule,
    CategorieRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,

    
  ]
})
export class CategorieModule { }
