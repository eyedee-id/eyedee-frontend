import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfideRoutingModule } from './confide-routing.module';
import { ConfideComponent } from './confide.component';


@NgModule({
  declarations: [
    ConfideComponent
  ],
  imports: [
    CommonModule,
    ConfideRoutingModule
  ]
})
export class ConfideModule { }
