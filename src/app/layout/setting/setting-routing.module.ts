import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from "./setting.component";

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'profile',
    loadChildren: () => import('./setting-profile/setting-profile.module').then(m => m.SettingProfileModule),
  },
  {
    path: 'email',
    loadChildren: () => import('./setting-email/setting-email.module').then(m => m.SettingEmailModule),
  },
  {
    path: 'security',
    loadChildren: () => import('./setting-security/setting-security.module').then(m => m.SettingSecurityModule),
  },
  {
    path: 'theme',
    loadChildren: () => import('./setting-theme/setting-theme.module').then(m => m.SettingThemeModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
