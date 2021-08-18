import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {concat, interval} from 'rxjs';
import {first} from 'rxjs/operators';

@Injectable()
export class CheckForUpdateService {

  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    if (!updates.isEnabled) {
      return;
    }
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable));
    const everyOneHour$ = interval(60 * 60 * 1000);
    const everyOneHourOnceAppIsStable$ = concat(appIsStable$, everyOneHour$);

    everyOneHourOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
  }
}
