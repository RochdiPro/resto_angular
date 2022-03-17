import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjouterBallanceRoutingModule } from './ajouter-ballance-routing.module';
import { AjouterBallanceComponent } from './ajouter-ballance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AjouterBallanceComponent],
  imports: [
    CommonModule,
    AjouterBallanceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AjouterBallanceModule { }
