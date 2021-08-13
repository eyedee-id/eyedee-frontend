import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NewRoutingModule} from './new-routing.module';
import {NewConfideComponent} from './new-confide/new-confide.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NewComponent} from './new.component';
import {ConfideService} from "../../../shared/services/confide.service";


@NgModule({
  declarations: [
    NewComponent,
    NewConfideComponent
  ],
  imports: [
    CommonModule,
    NewRoutingModule,
    NavigationBottomModule,
    ReactiveFormsModule
  ],
  exports: [
    NewConfideComponent,
  ],
  providers: [
    ConfideService,
  ],
})
export class NewModule {
}
