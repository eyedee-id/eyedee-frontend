import {ApplicationRef, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PubSubService} from "../../shared/services/pub-sub.service";
import {Subscription} from "rxjs";

import dayjs from "dayjs";

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)


import {Auth} from '@aws-amplify/auth';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {

  subscription: {
    [key: string]: null | Subscription
  } = {
    app_is_stable: null,
  };

  constructor(
    private appRef: ApplicationRef,
    private pubSubService: PubSubService,
  ) {
  }

  ngOnInit() {
    Auth.currentCredentials()
      .then(res => {
        if (!res.identityId) {
          return;
        }

        this.pubSubService.startPubSub()
          .then(() => {
          });
      })
  }
}
