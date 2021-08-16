import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfideModel} from "../../../../shared/models/confide.model";
import {fromEvent, Subject, Subscription} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {ConfideService} from "../../../../shared/services/confide.service";
import * as dayjs from "dayjs";
import 'dayjs/locale/id' // import locale
import {code} from "../../../../shared/libs/code";
import {takeUntil} from "rxjs/operators";
import * as relativeTime from 'dayjs/plugin/relativeTime';
import {ActivatedRoute, Router} from "@angular/router";
import {findAndReplaceHashTag} from "../../../../shared/libs/hashtag";
import {confideAnimation} from "../../../../shared/animations/confide.animation";
import {secretbox} from "tweetnacl";
import {decodeBase64, encodeUTF8} from "tweetnacl-util";

dayjs.extend(relativeTime);
dayjs.locale('id');

@Component({
  selector: 'app-user-private-confides',
  templateUrl: './user-private-confides.component.html',
  styleUrls: ['./user-private-confides.component.scss'],
  animations: [
    confideAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPrivateConfidesComponent implements OnInit, OnDestroy {

  @Input() userId: string | undefined = undefined;

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
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private confideService: ConfideService,
  ) {
  }

  ngOnInit(): void {
    if (!this.userId) {
      return;
    }
    // this.subscription.user_id = this.route.params.subscribe(res => {
    //   this.userId = res.userId;
    this.getConfides(true);
    // })
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
        order_id: this.confides[latestIdx].order_id,
      }
    }

    this.error.confides = null;
    this.loading.confides = true;
    this.ref.markForCheck();

    this.subscription.confides = this.confideService
      .confideUserPrivate(params)
      .subscribe(res => {
        if (res.status) {

          this.ref.detach();

          const arr2Length = res.data.length;
          if (arr2Length > 0) {

            const secretKey = localStorage.getItem('user.secret_key');
            if (secretKey) {

              // Pre allocate size
              const arr1Length = this.confides.length;
              // this.confides.length = arr1Length + arr2Length;

              for (let i = 0; i < arr2Length; i++) {

                if (res.data[i] && res.data[i].message && res.data[i].nonce) {
                  const cipherTextDecrypted = secretbox.open(
                    decodeBase64(res.data[i].message as string),
                    decodeBase64(res.data[i].nonce as string),
                    decodeBase64(secretKey)
                  );

                  if (cipherTextDecrypted) {
                    const messageDecrypted = JSON.parse(encodeUTF8(cipherTextDecrypted));

                    messageDecrypted.text = findAndReplaceHashTag(messageDecrypted.text);
                    messageDecrypted.at_created_string = dayjs(messageDecrypted.at_created).fromNow();
                    this.confides[arr1Length + i] = messageDecrypted;
                  }
                }
              }
            }
          }

          if (res.meta && res.meta.limit && arr2Length < res.meta.limit) {
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
