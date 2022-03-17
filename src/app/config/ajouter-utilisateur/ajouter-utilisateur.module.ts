import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjouterUtilisateurRoutingModule } from './ajouter-utilisateur-routing.module';
import { AjouterUtilisateurComponent } from './ajouter-utilisateur.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

 
 import { MatCardModule } from '@angular/material/card';
 


@NgModule({
  declarations: [AjouterUtilisateurComponent],
  imports: [
    CommonModule,
    AjouterUtilisateurRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
  ]
})
export class AjouterUtilisateurModule { }
