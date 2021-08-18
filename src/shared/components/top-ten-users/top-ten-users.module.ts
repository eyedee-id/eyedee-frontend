import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopTenUsersComponent } from './top-ten-users.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    TopTenUsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TopTenUsersComponent
  ]
})
export class TopTenUsersModule { }
