import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutRoutingModule} from './layout-routing.module';
import {LayoutComponent} from "./layout.component";
import {NavigationSideModule} from "../../shared/components/navigation-side/navigation-side.module";
import {TopTenUsersModule} from "../../shared/components/top-ten-users/top-ten-users.module";
import {TopTenHashtagsModule} from "../../shared/components/top-ten-hashtags/top-ten-hashtags.module";
import {NavigationBottomModule} from "../../shared/components/navigation-bottom/navigation-bottom.module";
import {PubSubModule} from "../../shared/modules/pub-sub.module";


@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NavigationSideModule,
    TopTenUsersModule,
    TopTenHashtagsModule,
    NavigationBottomModule,
    PubSubModule,
  ],
  providers: [
  ],
})
export class LayoutModule {
}
