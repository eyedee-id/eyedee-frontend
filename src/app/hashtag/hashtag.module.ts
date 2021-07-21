import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HashtagRoutingModule } from './hashtag-routing.module';
import {HashtagComponent} from './hashtag.component';


@NgModule({
  declarations: [
    HashtagComponent,
  ],
  imports: [
    CommonModule,
    HashtagRoutingModule
  ]
})
export class HashtagModule { }
