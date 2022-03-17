import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from 'mat-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [BalanceComponent],
  imports: [
    CommonModule,
    BalanceRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class BalanceModule { }
