import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExploreRoutingModule} from './explore-routing.module';
import {ExploreComponent} from './explore.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TopTenHashtagsModule} from '../../../shared/components/top-ten-hashtags/top-ten-hashtags.module';
import {TopTenUsersModule} from '../../../shared/components/top-ten-users/top-ten-users.module';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import {NewModule} from '../new/new.module';
import {NavigationSideModule} from "../../../shared/components/navigation-side/navigation-side.module";
import {ConfideService} from "../../../shared/services/confide.service";
import {PubSubModule} from "../../../shared/modules/pub-sub.module";
import {NavigationTitleModule} from "../../../shared/components/navigation-title/navigation-title.module";
import {FallbackImgModule} from "../../../shared/directives/fallback-img.module";

@NgModule({
  declarations: [
    ExploreComponent,
  ],
  imports: [
    CommonModule,
    ExploreRoutingModule,
    ReactiveFormsModule,
    TopTenHashtagsModule,
    TopTenUsersModule,
    NavigationBottomModule,
    NewModule,
    NavigationSideModule,
    PubSubModule,
    NavigationTitleModule,
    FallbackImgModule,
  ],
  providers: [
    ConfideService,
  ],
})
export class ExploreModule {
}
