import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FallbackImgDirective} from "./fallback-img.directive";


@NgModule({
  declarations: [
    FallbackImgDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FallbackImgDirective,
  ]
})
export class FallbackImgModule {
}
