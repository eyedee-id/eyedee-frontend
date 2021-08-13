import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {AuthGuard} from "../../shared/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule),
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'trending',
      //   loadChildren: () => import('./trending/trending.module').then(m => m.TrendingModule),
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'confide/:confide_id',
        loadChildren: () => import('./confide/confide.module').then(m => m.ConfideModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'hashtag/:hashtag',
        loadChildren: () => import('./hashtag/hashtag.module').then(m => m.HashtagModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'new',
        loadChildren: () => import('./new/new.module').then(m => m.NewModule),
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'messages',
      //   loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
        canActivate: [AuthGuard],
      },
      {
        path: ':username',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
