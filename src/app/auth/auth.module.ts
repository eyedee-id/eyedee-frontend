import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {RegisterConfirmationComponent} from './register-confirmation/register-confirmation.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {NavigationBottomModule} from '../../shared/components/navigation-bottom/navigation-bottom.module';
import {AuthService} from "../../shared/services/auth.service";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NavigationBottomModule,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule {
}
