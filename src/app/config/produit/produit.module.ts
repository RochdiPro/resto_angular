import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitRoutingModule } from './produit-routing.module';
import { ProduitComponent } from './produit.component';
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
  declarations: [ProduitComponent ],
  imports: [
    CommonModule,
    ProduitRoutingModule,     
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
export class ProduitModule { }
