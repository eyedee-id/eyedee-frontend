import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExploreRoutingModule} from './explore-routing.module';
import {ExploreComponent} from './explore.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TopTenHashtagsModule} from '../../shared/components/top-ten-hashtags/top-ten-hashtags.module';
import {TopTenUsersModule} from '../../shared/components/top-ten-users/top-ten-users.module';
import {NavigationBottomModule} from '../../shared/components/navigation-bottom/navigation-bottom.module';

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
  ]
})
export class ExploreModule {
}
