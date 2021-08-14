import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTitleComponent } from './navigation-title.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    NavigationTitleComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationTitleComponent
  ]
})
export class NavigationTitleModule { }
