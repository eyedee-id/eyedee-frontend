import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
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
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    password: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
      ]
    }),
    password_confirmation: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
        this.matchValues('password'),
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

  matchValues(matchTo: string): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      // @ts-ignore
      return !!control.parent && !!control.parent.value && control.value === control.parent.controls[matchTo].value
        ? null
        : {isMatching: false};
    };
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
        this.router.navigate(['/auth/login']);
      }, err => {
        this.loading.register = false;
        this.error.register = err.message ?? code.error.internal_server_error;
        this.form.markAsPristine();
        this.ref.detectChanges();
      })
  }
}
