import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {takeUntil} from 'rxjs/operators';
import {ConfideService} from '../../../shared/services/confide.service';
import {code} from '../../../shared/libs/code';
import {ConfideModel} from '../../../shared/models/confide.model';
import * as dayjs from 'dayjs';
import 'dayjs/locale/id' // import locale
import * as relativeTime from 'dayjs/plugin/relativeTime';
import {ActivatedRoute, Router, RouterEvent} from "@angular/router";
import {findAndReplaceHashTag} from "../../../shared/libs/hashtag";
import {confideAnimation} from "../../../shared/animations/confide.animation";

dayjs.extend(relativeTime);
dayjs.locale('id');


@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.scss'],
  animations: [
    confideAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashtagComponent implements OnInit, OnDestroy {

  hashtag: string | null = null;

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
    hashtag: null,
    confides: null,
  };

  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private confideService: ConfideService,
  ) {

  }

  ngOnInit(): void {
    this.subscription.router_events = this.router.events
      .subscribe(res => {
        if (res.constructor.name === 'NavigationStart') {
          if ((res as RouterEvent).url.split('/')[1] === this.hashtag) {
            this.confides = [];
            this.getConfides(true);
          }
        }
      })


    this.subscription.hashtag = this.route.params.subscribe(res => {
      this.hashtag = res.hashtag;
      this.confides = [];
      this.getConfides(true);
    })
  }

  public trackById(index: number, item: ConfideModel) {
    return item.confide_id;
  }

  ngOnDestroy() {
    if (this.subscription.confides) {
      this.subscription.confides.unsubscribe();
    }

    if (this.subscription.hashtag) {
      this.subscription.hashtag.unsubscribe();
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
      !init && (
        this.noMoreConfide
        || this.loading.confides
        || !this.hashtag
      )
    ) {
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

    this.subscription.confides = this.confideService
      .confideHashtag(this.hashtag, params)
      .subscribe(res => {
        if (res.status) {

          this.ref.detach();

          if (res.data.length > 0) {

            if (init) {
              for (const item of res.data) {
                item.text = findAndReplaceHashTag(item.text, this.hashtag);
                item.at_created_string = dayjs(item.at_created).fromNow();
              }

              this.confides = res.data;
            } else {

              // Pre allocate size
              const arr1Length = this.confides.length;
              const arr2Length = res.data.length;

              this.confides.length = arr1Length + arr2Length;
              for (let i = 0; i < arr2Length; i++) {
                res.data[i].text = findAndReplaceHashTag(res.data[i].text);
                res.data[i].at_created_string = dayjs(res.data[i].at_created).fromNow();
                this.confides[arr1Length + i] = res.data[i]
              }
            }
          }

          if (res.meta && res.meta.limit && res.data.length < res.meta.limit) {
            this.noMoreConfide = true;
            this.destroy.next();
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

  onClickUserText(event: any) {
    let hashtagRoute = event.target.attributes.value?.value;
    if (hashtagRoute) {
      this.router.navigate([hashtagRoute]);
    }
  }
}
