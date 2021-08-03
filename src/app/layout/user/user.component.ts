import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {

  username = null;
  user: any = null;

  subscription: {
    [key: string]: null | Subscription,
  } = {
    username: null,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.subscription.username = this.route.params.subscribe(res => {
      this.username = res.username;
      this.getUser();
      this.ref.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription.username) {
      this.subscription.username.unsubscribe();
    }
  }

  getUser() {
    this.user = {
      username: 'gilbert',
      photo_url: 'https://s3.arkjp.net/misskey/thumbnail-40729057-08ff-49c8-9366-609481a2de9e.png'
    }
  }
}
