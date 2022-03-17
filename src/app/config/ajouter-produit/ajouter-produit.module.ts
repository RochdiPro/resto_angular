import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjouterProduitRoutingModule } from './ajouter-produit-routing.module';
import { AjouterProduitComponent } from './ajouter-produit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
 
@NgModule({
  declarations: [AjouterProduitComponent],
  imports: [
    CommonModule,
    AjouterProduitRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatKeyboardModule
     
  ]
})
export class AjouterProduitModule { }
