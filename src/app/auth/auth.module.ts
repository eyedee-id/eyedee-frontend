import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AccountComponent} from './account/account.component';
import {RegisterConfirmationComponent} from './register-confirmation/register-confirmation.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {NavigationBottomModule} from '../../shared/components/navigation-bottom/navigation-bottom.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    RegisterConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NavigationBottomModule,
  ]
})
export class AuthModule {
}
