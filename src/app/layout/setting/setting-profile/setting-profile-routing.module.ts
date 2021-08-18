import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingProfileComponent} from "./setting-profile.component";

const routes: Routes = [
  {
    path: '',
    component: SettingProfileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingProfileRoutingModule {
}
