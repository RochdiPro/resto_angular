import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComposantComponent } from './composant.component';

const routes: Routes = [{ path: '', component: ComposantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComposantRoutingModule { }
