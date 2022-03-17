import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrixRoutingModule } from './prix-routing.module';
import { PrixComponent } from './prix.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
 import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
 import {  MatTableModule} from '@angular/material/table';
 import { MatSortModule } from '@angular/material/sort';
import { AjouterArticlesComponent } from 'src/app/achat/ajouter-articles/ajouter-articles.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PrixComponent],
  imports: [
    CommonModule,
    PrixRoutingModule,
    CommonModule,     
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
     FormsModule, ReactiveFormsModule 

  ]
})
export class PrixModule { }
