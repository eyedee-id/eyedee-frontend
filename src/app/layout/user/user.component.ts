import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterEvent} from '@angular/router';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {code} from "../../../shared/libs/code";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {

  username: string = '';
  user: any = null;

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
          this.user = res.data;
          this.router.navigate([this.user.user_id, 'confides'], {relativeTo: this.route});
        } else {
          this.error.user = res.message ?? code.error.internal_server_error;
        }

        this.loading.user = false;
        this.ref.detectChanges();
      }, err => {
        this.error.user = err.message ?? code.error.internal_server_error;
        this.loading.user = false;
        this.ref.detectChanges();
      });
  }
}
