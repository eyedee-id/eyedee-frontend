import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {NavigationTopModule} from '../shared/components/navigation-top/navigation-top.module';
import { LayoutComponent } from './layout/layout.component';
import {NavigationSideModule} from "../shared/components/navigation-side/navigation-side.module";
import {TopTenUsersModule} from "../shared/components/top-ten-users/top-ten-users.module";
import {TopTenHashtagsModule} from "../shared/components/top-ten-hashtags/top-ten-hashtags.module";
import {NavigationBottomModule} from "../shared/components/navigation-bottom/navigation-bottom.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NavigationTopModule,
    NavigationSideModule,
    TopTenUsersModule,
    TopTenHashtagsModule,
    NavigationBottomModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
