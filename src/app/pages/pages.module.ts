import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {ExploreComponent} from './explore/explore.component';
import { TrendingComponent } from './trending/trending.component';
import { PagesComponent } from './pages.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    PagesComponent,
    ExploreComponent,
    TrendingComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule
  ]
})
export class PagesModule {
}
