import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {

  username = null;

  subscription: {
    [key: string]: null | Subscription,
  } = {
    username: null,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.subscription.username = this.route.params.subscribe(res => {
      this.username = res.username;
      this.ref.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription.username) {
      this.subscription.username.unsubscribe();
    }
  }

}
