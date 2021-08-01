import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HashtagRoutingModule } from './hashtag-routing.module';
import {HashtagComponent} from './hashtag.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';


@NgModule({
  declarations: [
    HashtagComponent,
  ],
  imports: [
    CommonModule,
    HashtagRoutingModule,
    NavigationBottomModule
  ]
})
export class HashtagModule { }
