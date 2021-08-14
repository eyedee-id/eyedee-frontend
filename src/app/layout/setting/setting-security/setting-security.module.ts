import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingSecurityRoutingModule } from './setting-security-routing.module';
import { SettingSecurityComponent } from './setting-security.component';
import {NavigationTitleModule} from "../../../../shared/components/navigation-title/navigation-title.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SettingSecurityComponent
  ],
  imports: [
    CommonModule,
    SettingSecurityRoutingModule,
    NavigationTitleModule,
    ReactiveFormsModule
  ]
})
export class SettingSecurityModule { }
