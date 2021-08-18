import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollPositionDirective} from './scroll-position.directive';
import {ScrollPositionService} from "./scroll-position.service";


@NgModule({
  declarations: [
    ScrollPositionDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ScrollPositionService,
  ],
  exports: [
    ScrollPositionDirective
  ]
})
export class ScrollPositionModule {
}
