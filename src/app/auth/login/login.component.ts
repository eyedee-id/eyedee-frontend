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
        Validators.minLength(8),
      ]
    }),
  })

  loading = {
    login: false,
    resend: false,
  };

  error: {
    [key: string]: null | string | boolean,
  } = {
    login: null,
    user_no_confirmed: false,
    resend: null,
  };

  userConfirmationEmail: string | null = null;

  subscription: {
    [key: string]: null | Subscription,
  } = {
    form: null,
    login: null,
    resend: null,
  };

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
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
    this.error.login = null;
    this.error.resend = null;
    this.error.user_no_confirmed = false;
    this.ref.detectChanges();

    this.authService.signIn(this.form.value.username, this.form.value.password)
      .subscribe(res => {
        this.router.navigate(['/explore']);
      }, err => {
        this.loading.login = false;
        if (err?.message === 'User is not confirmed.') {
          this.error.user_no_confirmed = true;
        }
        this.error.login = err.message ?? code.error.internal_server_error;
        this.form.markAsPristine();
        this.ref.detectChanges();
      })
  }


  resendCode() {
    if (this.form.controls['username'].invalid) {
      return;
    }

    const value = this.form.value;
    const username = value.username;
    this.error.login = null;
    this.error.resend = null;
    this.loading.resend = true;
    this.ref.detectChanges();

    this.authService.resendSignUp(username)
      .subscribe(
        res => {
          this.userConfirmationEmail = res?.CodeDeliveryDetails?.Destination ?? null;

          this.loading.resend = false;
          this.ref.detectChanges();
        },
        err => {
          this.loading.resend = false;
          this.error.resend = err.message ?? code.error.internal_server_error;
          this.ref.detectChanges();
        });
  }

}
