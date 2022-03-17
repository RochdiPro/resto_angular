import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [ConfigComponent, DialogueComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    MatDialogModule
  ]
})
export class ConfigModule { }
