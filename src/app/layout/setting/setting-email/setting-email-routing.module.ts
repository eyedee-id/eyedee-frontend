import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingEmailComponent} from "./setting-email.component";

const routes: Routes = [
  {
    path: '',
    component: SettingEmailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingEmailRoutingModule { }
