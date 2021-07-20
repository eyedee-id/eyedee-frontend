import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {code} from '../../../shared/libs/code';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterConfirmationComponent implements OnInit, OnDestroy {
  formConfirmation = new FormGroup({
    email: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    code: new FormControl(null, Validators.required),
  });

  loading = {
    confirm: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    confirm: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    form: null,
  };

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.form = this.formConfirmation.valueChanges
      .subscribe(() => {
        this.error.confirm = null;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription.form) {
      this.subscription.form.unsubscribe();
    }
  }

  onSubmitConfirmation() {
    const value = this.formConfirmation.value;
    const email = value.email, confirmationCode = value.code;
    this.loading.confirm = true;
    this.ref.detectChanges();
    this.authService.confirmSignUp(email, confirmationCode)
      .subscribe(
        res => {
          this.router.navigate(['/auth/login']);
        },
        err => {
          this.loading.confirm = false;
          this.error.confirm = err.message ?? code.error.internal_server_error;
          this.formConfirmation.markAsPristine();
          this.ref.detectChanges();
        });
  }

}
