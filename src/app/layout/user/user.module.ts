import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import {UserConfidesComponent} from './user-confides/user-confides.component';
import {UserMentionsComponent} from './user-mentions/user-mentions.component';
import {ConfideService} from "../../../shared/services/confide.service";
import {UserService} from "../../../shared/services/user.service";
import {FallbackImgModule} from "../../../shared/directives/fallback-img/fallback-img.module";
import { UserPrivateConfidesComponent } from './user-private-confides/user-private-confides.component';


@NgModule({
  declarations: [
    UserComponent,
    UserConfidesComponent,
    UserMentionsComponent,
    UserPrivateConfidesComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NavigationBottomModule,
    FallbackImgModule
  ],
  providers: [
    UserService,
    ConfideService,
  ],
})
export class UserModule {
}
