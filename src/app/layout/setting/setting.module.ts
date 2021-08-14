import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingRoutingModule} from './setting-routing.module';
import {SettingComponent} from './setting.component';
import {NavigationTitleModule} from "../../../shared/components/navigation-title/navigation-title.module";


@NgModule({
  declarations: [
    SettingComponent,

  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    NavigationTitleModule,
  ]
})
export class SettingModule {
}
