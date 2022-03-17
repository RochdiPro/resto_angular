import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AchatComponent } from './achat.component';

const routes: Routes = [{ path: '', component: AchatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchatRoutingModule { }
