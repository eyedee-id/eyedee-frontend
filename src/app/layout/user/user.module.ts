import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserComponent} from './user.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NavigationBottomModule
  ]
})
export class UserModule { }
