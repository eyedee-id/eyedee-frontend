import {ApplicationRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
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
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private appRef: ApplicationRef,
    private pubSubService: PubSubService,
  ) {
  }

  ngOnInit() {
    Auth.currentCredentials()
      .then(async res => {
        if (!res.identityId) {
          return;
        }

        try {
          await this.pubSubService
            .iotPolicyAttachConnect({
              identity_id: res.identityId,
            })
            .toPromise();

          this.pubSubService.updateCredentials(res);
          this.pubSubService.start();
        } catch (e) {
          console.error(e);
        }
      })
  }

  ngOnDestroy() {
    this.pubSubService.stop();
  }
}
