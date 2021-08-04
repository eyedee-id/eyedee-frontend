import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {LayoutComponent} from "./layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'account',
        loadChildren: () => import('./layout/account/account.module').then(m => m.AccountModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'explore',
        loadChildren: () => import('./layout/explore/explore.module').then(m => m.ExploreModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'trending',
        loadChildren: () => import('./layout/trending/trending.module').then(m => m.TrendingModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'confide/:confide_id',
        loadChildren: () => import('./layout/confide/confide.module').then(m => m.ConfideModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'hashtag/:hashtag',
        loadChildren: () => import('./layout/hashtag/hashtag.module').then(m => m.HashtagModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'new',
        loadChildren: () => import('./layout/new/new.module').then(m => m.NewModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'messages',
        loadChildren: () => import('./layout/message/message.module').then(m => m.MessageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'setting',
        loadChildren: () => import('./layout/setting/setting.module').then(m => m.SettingModule),
        canActivate: [AuthGuard],
      },
      {
        path: ':username',
        loadChildren: () => import('./layout/user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
