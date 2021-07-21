import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';
import {takeUntil} from 'rxjs/operators';
import {ConfideService} from '../../shared/services/confide.service';
import {code} from '../../shared/libs/code';
import {ConfideModel} from '../../shared/models/confide.model';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit, OnDestroy {

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
    confides: null,
  };

  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  constructor(
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private confideService: ConfideService,
  ) {

  }

  ngOnInit(): void {

    this.getConfides(true);
  }

  public trackById(index: number, item: ConfideModel) {
    return item.confide_id;
  }

  ngOnDestroy() {
    if (this.subscription.confide) {
      this.subscription.confide.unsubscribe();
    }

    this.destroy.next();
  }

  initAutoScroll() {
    const main = document.getElementsByTagName('main').item(0) ?? null;
    console.log(main);
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
    if (this.loading.confides) {
      return;
    }

    if (this.subscription.confides && !this.subscription.confides.closed) {
      this.subscription.confides.unsubscribe();
    }

    let params = {};
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

    this.confideService
      .confideExplore(params)
      .subscribe(res => {
        if (res.status) {

          if (res.data.length === 0) {
            this.noMoreConfide = true;
          } else {

            for (const item of res.data) {
              item.at_created_string = dayjs(item.at_created).fromNow();
            }

            if (init) {
              this.confides = res.data;
            } else {
              this.confides = [...this.confides, ...res.data];
            }
          }
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
