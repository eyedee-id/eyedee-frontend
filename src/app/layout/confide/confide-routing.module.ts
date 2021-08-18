import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConfideComponent} from "./confide.component";

const routes: Routes = [
  {
    path: '',
    component: ConfideComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfideRoutingModule { }
