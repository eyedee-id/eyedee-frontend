import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingSecurityComponent} from "./setting-security.component";

const routes: Routes = [
  {
    path: '',
    component: SettingSecurityComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingSecurityRoutingModule { }
