import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingThemeComponent} from "./setting-theme.component";

const routes: Routes = [
  {
    path: '',
    component: SettingThemeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingThemeRoutingModule { }
