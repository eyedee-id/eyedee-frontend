import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTopComponent } from './navigation-top.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    NavigationTopComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationTopComponent
  ]
})
export class NavigationTopModule { }
