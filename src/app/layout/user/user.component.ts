import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router, RouterEvent} from '@angular/router';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {code} from "../../../shared/libs/code";
import {UserModel} from "../../../shared/models/user.model";

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
          // res.data.avatar_url = 'https://nos3.arkjp.net/?url=https%3A%2F%2Fimg.pawoo.net%2Faccounts%2Favatars%2F000%2F748%2F032%2Foriginal%2F0c1478df964637b8.jpeg&thumbnail=1';
          res.data.banner_url = 'https://nos3.arkjp.net/?url=https%3A%2F%2Fstorage.googleapis.com%2Fyysk.icu%2Faccounts%2Fheaders%2F000%2F000%2F001%2Foriginal%2Fdc4961291058cb6f.jpg';
          this.user = res.data as UserModel;

          this.userCanEdit = this.authService.user?.user_id === this.user.user_id;

          this.router.navigate([this.user.user_id, 'confides'], {relativeTo: this.route});
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
}
