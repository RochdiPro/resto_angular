import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonneesRoutingModule } from './donnees-routing.module';
import { DonneesComponent } from './donnees.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
 import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
 import {  MatTableModule} from '@angular/material/table';
 import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [DonneesComponent],
  imports: [
    CommonModule,
    DonneesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
     ReactiveFormsModule,
     MatPaginatorModule,
     MatTableModule,
     MatSortModule,
     MatProgressBarModule,
     FormsModule ,
     MatKeyboardModule,MatDialogModule,
     MatDatepickerModule,   
     MatNativeDateModule 
  ]
})
export class DonneesModule { }
