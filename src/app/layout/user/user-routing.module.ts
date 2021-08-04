import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {UserConfidesComponent} from "./user-confides/user-confides.component";
import {UserMentionsComponent} from "./user-mentions/user-mentions.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: ':userId/confides',
        component: UserConfidesComponent,
      },
      {
        path: ':userId/mentions',
        component: UserMentionsComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
