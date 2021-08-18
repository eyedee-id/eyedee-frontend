import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {code} from '../../../shared/libs/code';
import {Router} from '@angular/router';
import {box, hash} from "tweetnacl";
import {decodeUTF8, encodeBase64} from "tweetnacl-util";
import { aesEncryptData} from "../../../shared/libs/aes";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    // email: new FormControl(null, {
    //   validators: [
    //     Validators.required,
    //     Validators.email,
    //   ]
    // }),
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
    [key: string]: null | any,
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

    // ketika register, user akan generate keyPair, menggunakan tweetnacl-js.
    // kemudian secretKey akan di encrypt menggunakan password user (AES)
    // publicKey & encrypted secretKey akan di upload ke cognito:customAttribute & dynamodb
    const userKeyPair = box.keyPair();


    const aesEncrypted = aesEncryptData(
      encodeBase64(userKeyPair.secretKey), // convert secret ke base64
      encodeBase64(hash(decodeUTF8(this.form.controls['password'].value))), // convert hashed password user ke base64
    );

    const attributes = {
      'custom:public_key': encodeBase64(userKeyPair.publicKey), // base64
      'custom:secret_key': aesEncrypted, // base64
    };

    // note: decrypt secretKey nanti ketika login

    this.loading.register = true;
    this.ref.detectChanges();

    this.authService.signUp({
      ...this.form.value,
      attributes,
    })
      .subscribe(res => {
        if (res.userConfirmed) {

          // langsung login
          this.authService.signIn(this.form.value.username, this.form.value.password)
            .subscribe(() => {
              this.router.navigate(['/explore']);
            }, err => {
              this.loading.register = false;
              if (err?.message === 'User is not confirmed.') {
                this.error.user_no_confirmed = true;
              }
              this.error.login = err.message ?? code.error.internal_server_error;
              this.form.markAsPristine();
              this.ref.detectChanges();
            })

        } else {
          this.router.navigate(['/auth/login']);
        }
      }, err => {
        this.loading.register = false;
        this.error.register = err.message ?? code.error.internal_server_error;
        this.form.markAsPristine();
        this.ref.detectChanges();
      })
  }
}
