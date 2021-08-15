import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HashtagRoutingModule } from './hashtag-routing.module';
import {HashtagComponent} from './hashtag.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import {ConfideService} from "../../../shared/services/confide.service";
import {NavigationTitleModule} from "../../../shared/components/navigation-title/navigation-title.module";
import {FallbackImgModule} from "../../../shared/directives/fallback-img.module";


@NgModule({
  declarations: [
    HashtagComponent,
  ],
  imports: [
    CommonModule,
    HashtagRoutingModule,
    NavigationBottomModule,
    NavigationTitleModule,
    FallbackImgModule
  ],
  providers: [
    ConfideService,
  ],
})
export class HashtagModule { }
