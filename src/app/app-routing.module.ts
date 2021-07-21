import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../shared/guards/auth.guard';

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
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule),
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
  {
    path: ':username',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
