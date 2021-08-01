import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationSideComponent } from './navigation-side.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    NavigationSideComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationSideComponent
  ]
})
export class NavigationSideModule { }
