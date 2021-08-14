import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NewRoutingModule} from './new-routing.module';
import {NewConfideComponent} from './new-confide/new-confide.component';
import {NavigationBottomModule} from '../../../shared/components/navigation-bottom/navigation-bottom.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NewComponent} from './new.component';
import {ConfideService} from "../../../shared/services/confide.service";
import {NavigationTitleModule} from "../../../shared/components/navigation-title/navigation-title.module";


@NgModule({
  declarations: [
    NewComponent,
    NewConfideComponent
  ],
  imports: [
    CommonModule,
    NewRoutingModule,
    NavigationBottomModule,
    ReactiveFormsModule,
    NavigationTitleModule
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
