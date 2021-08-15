import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingProfileRoutingModule } from './setting-profile-routing.module';
import {SettingProfileComponent} from "./setting-profile.component";
import {ReactiveFormsModule} from "@angular/forms";

import {ImageCropperModule} from "ngx-image-cropper";
import * as Hammer from "hammerjs";
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from "@angular/platform-browser";
import {UserService} from "../../../../shared/services/user.service";
import {NavigationTitleModule} from "../../../../shared/components/navigation-title/navigation-title.module";
import {FallbackImgModule} from "../../../../shared/directives/fallback-img.module";

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    SettingProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingProfileRoutingModule,
    ImageCropperModule,
    NavigationTitleModule,
    FallbackImgModule,
  ],
  providers: [
    UserService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ]
})
export class SettingProfileModule { }
