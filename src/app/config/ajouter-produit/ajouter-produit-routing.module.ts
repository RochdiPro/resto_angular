import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjouterProduitComponent } from './ajouter-produit.component';

const routes: Routes = [{ path: '', component: AjouterProduitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjouterProduitRoutingModule { }
