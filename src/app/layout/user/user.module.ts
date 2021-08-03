import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserComponent} from './user.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import { UserConfidesComponent } from './user-confides/user-confides.component';
import { UserMentionsComponent } from './user-mentions/user-mentions.component';


@NgModule({
  declarations: [
    UserComponent,
    UserConfidesComponent,
    UserMentionsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NavigationBottomModule
  ]
})
export class UserModule { }
