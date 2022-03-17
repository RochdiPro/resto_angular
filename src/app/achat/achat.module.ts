import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchatRoutingModule } from './achat-routing.module';
import { AchatComponent } from './achat.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {   FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
 import {  MatTableModule} from '@angular/material/table';
 import { MatSortModule } from '@angular/material/sort';
 import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
   import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
import { AjouterArticlesComponent } from './ajouter-articles/ajouter-articles.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [AchatComponent ,AjouterArticlesComponent],
  imports: [
    CommonModule,
    AchatRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
     ReactiveFormsModule,
     MatPaginatorModule,
     MatTableModule,
     MatSortModule,
     MatDialogModule ,
     MatDatepickerModule,   
     MatNativeDateModule  ,
     MatKeyboardModule ,
     MatFormFieldModule,
     MatInputModule,
     MatSelectModule,
     MatFormFieldModule,
     MatCardModule,
       MatPaginatorModule,
      MatTableModule,
      MatSortModule,
      MatProgressBarModule,
      FormsModule,  
  ]
})
export class AchatModule { }
