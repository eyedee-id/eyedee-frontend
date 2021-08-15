import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {NavigationTopModule} from '../shared/components/navigation-top/navigation-top.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PubSubModule} from "../shared/modules/pub-sub.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    PubSubModule.forRoot(),
    NavigationTopModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
