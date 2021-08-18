import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfideToUserComponent} from "./confide-to-user.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'not-found',
  },
  {
    path: ':username',
    component: ConfideToUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfideToUserRoutingModule {
}
