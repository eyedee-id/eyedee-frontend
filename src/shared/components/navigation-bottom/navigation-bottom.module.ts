import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBottomComponent } from './navigation-bottom.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    NavigationBottomComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationBottomComponent
  ]
})
export class NavigationBottomModule { }
