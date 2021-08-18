import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopTenHashtagsComponent } from './top-ten-hashtags.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    TopTenHashtagsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TopTenHashtagsComponent
  ]
})
export class TopTenHashtagsModule { }
