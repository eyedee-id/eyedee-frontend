import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfideService} from "../../../shared/services/confide.service";
import {Subscription} from "rxjs";
import {code} from "../../../shared/libs/code";
import {ConfideModel} from "../../../shared/models/confide.model";
import * as dayjs from "dayjs";

import 'dayjs/locale/id';
import {findAndReplaceHashTag} from "../../../shared/libs/hashtag";
dayjs.locale('id');

@Component({
  selector: 'app-confide',
  templateUrl: './confide.component.html',
  styleUrls: ['./confide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfideComponent implements OnInit, OnDestroy {

  confideId = '';
  confide: ConfideModel | null = null;

  loading = {
    confide: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    confide: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    confide_id: null,
    confide: null,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private confideService: ConfideService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.confide_id = this.route.params.subscribe(res => {
      this.confideId = res.confide_id;
      this.getConfide();
      this.ref.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription.confide) {
      this.subscription.confide.unsubscribe();
    }
  }

  getConfide() {
    if (this.loading.confide) {
      return;
    }

    if (this.subscription.confide && !this.subscription.confide.closed) {
      this.subscription.confide.unsubscribe();
    }

    this.confide = null;
    this.loading.confide = true;
    this.ref.markForCheck();

    this.subscription.user = this.confideService.confideDetail(this.confideId)
      .subscribe(res => {
        if (res.status) {
          res.data.text = findAndReplaceHashTag(res.data.text)
          this.confide = res.data;
          this.confide.at_created_string = dayjs(this.confide.at_created).format('D MMMM YYYY - h:mm A');
        } else {
          this.error.confide = res.message ?? code.error.internal_server_error;
        }

        this.loading.confide = false;
        this.ref.detectChanges();
      }, err => {
        this.error.confide = err.message ?? code.error.internal_server_error;
        this.loading.confide = false;
        this.ref.detectChanges();
      });
  }

  onClickUserText(event: any) {
    let hashtagRoute = event.target.attributes.value?.value;
    if (hashtagRoute) {
      this.router.navigate([hashtagRoute]);
    }
  }

}
