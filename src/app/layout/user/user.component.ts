import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router, RouterEvent} from '@angular/router';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {code} from "../../../shared/libs/code";
import {UserModel} from "../../../shared/models/user.model";
import {findAndReplaceHashTag} from "../../../shared/libs/hashtag";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild('userBanner', {static: false}) userBanner: ElementRef<any> | undefined;

  username: string = '';
  user: UserModel | null = null;
  userCanEdit = false;

  tabActive: 'confides' | 'mentions' = 'confides';

  loading = {
    user: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    user: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    router_events: null,
    username: null,
    user: null,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.subscription.router_events = this.router.events
      .subscribe(res => {
        if (res.constructor.name === 'NavigationStart') {
          if ((res as RouterEvent).url.split('/')[1] === this.username) {
            this.getUser();
          }
        }
      })

    this.subscription.username = this.route.params.subscribe(res => {
      this.username = res.username;
      this.getUser();
      this.ref.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription.router_events) {
      this.subscription.router_events.unsubscribe();
    }

    if (this.subscription.username) {
      this.subscription.username.unsubscribe();
    }
  }

  getUser() {
    if (this.loading.user) {
      return;
    }

    if (this.subscription.user && !this.subscription.user.closed) {
      this.subscription.user.unsubscribe();
    }

    this.loading.user = true;
    this.ref.markForCheck();

    this.subscription.user = this.userService.userGet(this.username)
      .subscribe(res => {
        if (res.status) {

          res.data.bio = findAndReplaceHashTag(res.data.bio);
          this.user = res.data as UserModel;

          this.userCanEdit = this.authService.user?.user_id === this.user.user_id;
        } else {
          this.error.user = res.message ?? code.error.internal_server_error;
        }

        this.loading.user = false;
        this.ref.detectChanges();

        if (this.user && this.user.banner_url) {
          const banner = this.userBanner?.nativeElement;
          if (banner) {
            banner.setAttribute('style', `background-image: url("${this.user.banner_url}"); background-position: center calc(50%);`);
          }
        }
      }, err => {
        this.error.user = err.message ?? code.error.internal_server_error;
        this.loading.user = false;
        this.ref.detectChanges();
      });
  }

  onChangeTab(tab: 'confides' | 'mentions') {
    this.tabActive = tab;
    this.ref.detectChanges();
  }

  onClickUserBio(event: any) {
    let hashtagRoute = event.target.attributes.value?.value;
    if (hashtagRoute) {
      this.router.navigate([hashtagRoute]);
    }
  }
}
