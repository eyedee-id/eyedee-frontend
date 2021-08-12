import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from "./setting.component";
import {SettingProfileComponent} from "./setting-profile/setting-profile.component";

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'profile',
    loadChildren: () => import('./setting-profile/setting-profile.module').then(m => m.SettingProfileModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
