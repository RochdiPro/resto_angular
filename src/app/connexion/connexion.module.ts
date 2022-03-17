import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnexionRoutingModule } from './connexion-routing.module';
import { ConnexionComponent } from './connexion.component';
import { MatInputModule } from 'mat-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
  

@NgModule({
  declarations: [ConnexionComponent],
  imports: [
    CommonModule,
    ConnexionRoutingModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,   
    MatKeyboardModule,
     MatProgressSpinnerModule
 
    ],
    

})
export class ConnexionModule { }
