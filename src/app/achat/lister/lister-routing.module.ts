import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListerComponent } from './lister.component';

const routes: Routes = [{ path: '', component: ListerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListerRoutingModule { }
