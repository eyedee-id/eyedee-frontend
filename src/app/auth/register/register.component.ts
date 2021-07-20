import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {code} from '../../../shared/libs/code';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    name: new FormControl(null),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
      ]
    }),
  })

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
    register: null,
  };

  constructor(
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

    this.authService.register(this.form.value)
      .subscribe(res => {
        this.loading.register = false;
      }, () => {
        this.loading.register = false;
        this.error.register = code.error.internal_server_error;
        this.form.markAsPristine();
      })
  }

}
