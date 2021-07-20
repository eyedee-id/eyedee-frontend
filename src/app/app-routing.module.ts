import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HomeComponent} from './home/home.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {AccountComponent} from './auth/account/account.component';
import {RegisterConfirmationComponent} from './auth/register-confirmation/register-confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'auth/register/confirmation',
    component: RegisterConfirmationComponent,
  },
  {
    path: 'auth/account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(value => value.PagesModule),
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
