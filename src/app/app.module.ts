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
import { NotFoundComponent } from './not-found/not-found.component';
import {CheckForUpdateService} from "../shared/services/service-worker/check-for-update.service";
import {HandleUnrecoverableStateService} from "../shared/services/service-worker/handle-unrecoverable-state.service";
import {LogUpdateService} from "../shared/services/service-worker/log-update.service";
import {PromptUpdateService} from "../shared/services/service-worker/prompt-update.service";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
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
  providers: [
    CheckForUpdateService,
    HandleUnrecoverableStateService,
    LogUpdateService,
    PromptUpdateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
