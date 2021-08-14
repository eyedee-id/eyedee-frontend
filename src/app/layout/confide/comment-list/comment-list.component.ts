import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';


import * as dayjs from 'dayjs';
import 'dayjs/locale/id' // import locale
import * as relativeTime from 'dayjs/plugin/relativeTime';
import {ConfideModel} from "../../../../shared/models/confide.model";
import {fromEvent, Subject, Subscription} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {ConfideService} from "../../../../shared/services/confide.service";
import {takeUntil} from "rxjs/operators";
import {code} from "../../../../shared/libs/code";
import {confideAnimation} from "../../../../shared/animations/confide.animation";

dayjs.extend(relativeTime);
dayjs.locale('id');


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  animations: [
    confideAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnInit, OnDestroy {

  @Input()
  confideId = '';

  noMoreComment = false;
  comments: Array<ConfideModel> = [];

  loading = {
    comments: false,
  };

  error: {
    [key: string]: null | string,
  } = {};

  subscription: {
    [key: string]: null | Subscription,
  } = {
    comments: null,
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
    this.getComments(true);
  }

  public trackById(index: number, item: ConfideModel) {
    return item.comment_id;
  }

  ngOnDestroy() {
    if (this.subscription.comments) {
      this.subscription.comments.unsubscribe();
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
            this.getComments();
            return;
          }
        });
    }
  }

  getComments(init = false) {
    if (
      this.noMoreComment
      || this.loading.comments
    ) {
      return;
    }

    if (this.subscription.comments && !this.subscription.comments.closed) {
      this.subscription.comments.unsubscribe();
    }

    let params = {};
    if (!init) {
      // check latest confides id
      const latestIdx = this.comments.length - 1;
      params = {
        at_created: this.comments[latestIdx].at_created,
        comment_id: this.comments[latestIdx].comment_id,
      }
    }

    this.error.comments = null;
    this.loading.comments = true;
    this.ref.markForCheck();

    this.subscription.comments = this.confideService
      .confideComments(this.confideId, params)
      .subscribe(res => {
        if (res.status) {

          this.ref.detach();

          const arr2Length = res.data.length;
          if (arr2Length > 0) {
            // Pre allocate size
            const arr1Length = this.comments.length;
            this.comments.length = arr1Length + arr2Length;
            for (let i = 0; i < arr2Length; i++) {
              // res.data[i].text = findAndReplaceHashTag(res.data[i].text);
              res.data[i].at_created_string = dayjs(res.data[i].at_created).fromNow();
              this.comments[arr1Length + i] = res.data[i]
            }
          }

          if (res.meta && res.meta.limit && arr2Length < res.meta.limit) {
            this.noMoreComment = true;
            this.destroy.next();
          }

          this.ref.reattach();
        } else {
          this.error.comments = res.message ?? code.error.internal_server_error;
        }

        this.loading.comments = false;
        this.ref.detectChanges();

        if (init) {
          this.initAutoScroll();
        }
      }, err => {
        this.error.comments = err.message ?? code.error.internal_server_error;
        this.loading.comments = false;
        this.ref.detectChanges();
      })
  }

}
