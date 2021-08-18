import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingEmailRoutingModule } from './setting-email-routing.module';
import { SettingEmailComponent } from './setting-email.component';
import {NavigationTitleModule} from "../../../../shared/components/navigation-title/navigation-title.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SettingEmailComponent
  ],
  imports: [
    CommonModule,
    SettingEmailRoutingModule,
    NavigationTitleModule,
    ReactiveFormsModule
  ]
})
export class SettingEmailModule { }
