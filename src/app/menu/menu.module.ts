import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { LienComponent } from './lien/lien.component';
 

@NgModule({
  declarations: [MenuComponent, LienComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
   ]
})
export class MenuModule { }
