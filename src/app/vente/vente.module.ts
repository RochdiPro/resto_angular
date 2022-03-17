import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenteRoutingModule } from './vente-routing.module';
import { reglement_dialogue, VenteComponent } from './vente.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
import { MatDialogModule, } from '@angular/material/dialog';
 
@NgModule({
  declarations: [VenteComponent, reglement_dialogue ],
  imports: [
    CommonModule,
    VenteRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatKeyboardModule,
    MatDialogModule,

  ]
})
export class VenteModule { }
