import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfideToUserRoutingModule } from './confide-to-user-routing.module';
import { ConfideToUserComponent } from './confide-to-user.component';
import {NavigationTitleModule} from "../../../shared/components/navigation-title/navigation-title.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ConfideService} from "../../../shared/services/confide.service";
import {UserService} from "../../../shared/services/user.service";
import {FallbackImgModule} from "../../../shared/directives/fallback-img.module";


@NgModule({
  declarations: [
    ConfideToUserComponent
  ],
  imports: [
    CommonModule,
    ConfideToUserRoutingModule,
    NavigationTitleModule,
    ReactiveFormsModule,
    FallbackImgModule
  ],
  providers: [
    UserService,
    ConfideService,
  ],
})
export class ConfideToUserModule { }
