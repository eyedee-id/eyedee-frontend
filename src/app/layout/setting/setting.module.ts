import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { SettingProfileComponent } from './setting-profile/setting-profile.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SettingComponent,
    SettingProfileComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
