import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenteComponent } from './vente.component';

const routes: Routes = [{ path: '', component: VenteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteRoutingModule { }
