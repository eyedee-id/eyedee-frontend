import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {code} from '../../../shared/libs/code';
import {AuthService} from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
      ]
    }),
  })

  loading = {
    login: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    login: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    form: null,
    login: null,
  };

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.form = this.form.valueChanges
      .subscribe(() => {
        this.error.login = null;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription.form) {
      this.subscription.form.unsubscribe();
    }
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.login = true;
    this.ref.markForCheck();

    this.authService.login(this.form.value)
      .subscribe(res => {
        this.loading.login = false;
        this.ref.markForCheck();
      }, () => {
        this.loading.login = false;
        this.error.login = code.error.internal_server_error;
        this.form.markAsPristine();

        /**
         * @todo: dummy auth
         */
        this.authService.user = true;
        this.router.navigate(['/pages/explore']);

        this.ref.markForCheck();
      })
  }

}
