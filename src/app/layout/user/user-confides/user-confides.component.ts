import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ConfideModel} from "../../../../shared/models/confide.model";
import {fromEvent, Subject, Subscription} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {ConfideService} from "../../../../shared/services/confide.service";
import * as dayjs from "dayjs";
import {code} from "../../../../shared/libs/code";
import {takeUntil} from "rxjs/operators";
import * as relativeTime from 'dayjs/plugin/relativeTime';
import {ActivatedRoute} from "@angular/router";

dayjs.extend(relativeTime);

@Component({
  selector: 'app-user-confides',
  templateUrl: './user-confides.component.html',
  styleUrls: ['./user-confides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfidesComponent implements OnInit, OnDestroy {

  userId = '';
  noMoreConfide = false;
  confides: Array<ConfideModel> = [];

  loading = {
    confides: false,
  };

  error: {
    [key: string]: null | string,
  } = {};

  subscription: {
    [key: string]: null | Subscription,
  } = {
    user_id: null,
    confides: null,
  };

  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private confideService: ConfideService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.user_id = this.route.params.subscribe(res => {
      this.userId = res.userId;
      this.getConfides(true);
    })
  }

  public trackById(index: number, item: ConfideModel) {
    return item.confide_id;
  }

  ngOnDestroy() {
    if (this.subscription.user_id) {
      this.subscription.user_id.unsubscribe();
    }

    if (this.subscription.confide) {
      this.subscription.confide.unsubscribe();
    }

    this.destroy.next();
  }

  initAutoScroll() {
    const main = document.getElementsByTagName('main').item(0) ?? null;
    if (main) {

      fromEvent(main, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: Event) => {
          if ((e.target as Element).scrollTop >= ((e.target as Element).scrollHeight - (e.target as Element).clientHeight)) {
            this.getConfides();
            return;
          }
        });
    }
  }

  getConfides(init = false) {
    if (
      this.noMoreConfide
      || this.loading.confides
    ) {
      return;
    }

    if (this.subscription.confides && !this.subscription.confides.closed) {
      this.subscription.confides.unsubscribe();
    }

    let params: any = {};
    params.user_id = this.userId;
    if (!init) {
      // check latest confides id
      const latestIdx = this.confides.length - 1;
      params = {
        at_created: this.confides[latestIdx].at_created,
        confide_id: this.confides[latestIdx].confide_id,
      }
    }

    this.error.confides = null;
    this.loading.confides = true;
    this.ref.markForCheck();

    this.subscription.confides = this.confideService
      .confideUser(params)
      .subscribe(res => {
        if (res.status) {

          if (res.data.length === 0) {
            this.noMoreConfide = true;
            this.destroy.next();
          } else {

            this.ref.detach();

            if (init) {
              for (const item of res.data) {
                item.at_created_string = dayjs(item.at_created).fromNow();
              }

              this.confides = res.data;
            } else {

              // Pre allocate size
              const arr1Length = this.confides.length;
              const arr2Length = res.data.length;

              this.confides.length = arr1Length + arr2Length;
              for (let i = 0; i < arr2Length; i++) {
                res.data[i].at_created_string = dayjs(res.data[i].at_created).fromNow();
                this.confides[arr1Length + i] = res.data[i]
              }
            }
          }

          this.ref.reattach();
        } else {
          this.error.confides = res.message ?? code.error.internal_server_error;
        }

        this.loading.confides = false;
        this.ref.detectChanges();

        if (init) {
          this.initAutoScroll();
        }
      }, err => {
        this.error.confides = err.message ?? code.error.internal_server_error;
        this.loading.confides = false;
        this.ref.detectChanges();
      })
  }
}
