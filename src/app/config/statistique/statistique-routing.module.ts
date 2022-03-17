import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatistiqueComponent } from './statistique.component';

const routes: Routes = [{ path: '', component: StatistiqueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatistiqueRoutingModule { }
