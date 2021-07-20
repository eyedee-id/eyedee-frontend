import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {code} from '../../../shared/libs/code';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    email: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
      ]
    }),
  });


  loading = {
    register: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    register: null,
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
    this.subscription.form = this.form.valueChanges
      .subscribe(() => {
        this.error.register = null;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription.form) {
      this.subscription.form.unsubscribe();
    }
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.register = true;
    this.ref.detectChanges();

    this.authService.signUp(this.form.value)
      .subscribe(res => {
        this.router.navigate(['/auth/register/confirmation']);
      }, err => {
        this.loading.register = false;
        this.error.register = err.message ?? code.error.internal_server_error;
        this.form.markAsPristine();
        this.ref.detectChanges();
      })
  }
}
