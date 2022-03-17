import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrixComponent } from './prix.component';

const routes: Routes = [{ path: '', component: PrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrixRoutingModule { }
