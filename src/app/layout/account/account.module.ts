import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import {AccountComponent} from "./account.component";
import {NavigationBottomModule} from "../../../shared/components/navigation-bottom/navigation-bottom.module";


@NgModule({
  declarations: [
    AccountComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NavigationBottomModule
  ]
})
export class AccountModule { }
