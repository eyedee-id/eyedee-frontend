import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingThemeRoutingModule } from './setting-theme-routing.module';
import { SettingThemeComponent } from './setting-theme.component';
import {NavigationTitleModule} from "../../../../shared/components/navigation-title/navigation-title.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SettingThemeComponent
  ],
  imports: [
    CommonModule,
    SettingThemeRoutingModule,
    NavigationTitleModule,
    FormsModule
  ]
})
export class SettingThemeModule { }
