import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewConfideComponent} from './new-confide/new-confide.component';
import {NewComponent} from './new.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent,
    children: [
      {
        path: '',
        redirectTo: 'confide',
      },
      {
        path: 'confide',
        component: NewConfideComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRoutingModule {
}
