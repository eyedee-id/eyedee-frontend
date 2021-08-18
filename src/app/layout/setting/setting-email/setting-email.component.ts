import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth, CognitoUser} from "@aws-amplify/auth";
import {code} from "../../../../shared/libs/code";

@Component({
  selector: 'app-setting-email',
  templateUrl: './setting-email.component.html',
  styleUrls: ['./setting-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingEmailComponent implements OnInit {

  user: CognitoUser | null = null;

  email: string | null = null;
  emailVerified = false;

  isOpenEmailVerificationForm = false;

  form = new FormGroup({
    email: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    password: new FormControl(null, {
      validators: [
        Validators.required,
      ]
    }),
  });

  formConfirmation = new FormGroup({
    code: new FormControl(null, {
      validators: [
        Validators.required,
      ],
    }),
  });

  error: any = {
    email: null,
    save: false,
    verification_send: null,
    verification_submit: null,
  };

  loading = {
    email: true,
    save: false,
    verification_send: false,
    verification_submit: false,
  };

  constructor(
    private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.initEmail();
  }

  initEmail() {
    this.loading.email = true;
    Auth.currentAuthenticatedUser({
      bypassCache: true,
    })
      .then(res => {

        this.user = res;
        if (res.attributes) {
          this.email = res.attributes.email;
          this.emailVerified = res.attributes.email_verified;

          this.form.controls['email'].patchValue(res.attributes.email);
          this.form.controls['email'].markAsUntouched();
          this.form.controls['email'].markAsPristine();
        }

        this.loading.email = false;
        this.ref.detectChanges();
      });
  }

  updateEmail() {
    if (this.form.invalid || this.loading.save || !this.user) {
      return;
    }

    this.loading.save = true;
    this.ref.detectChanges();

    Auth
      .updateUserAttributes(this.user, {
        'email': this.form.controls['email'].value,
      })
      .then(res => {
        if (res === 'SUCCESS') {
          this.loading.save = false;

          // langsung verfikasi emailnya
          this.form.controls['email'].disable();
          this.isOpenEmailVerificationForm = true;

          this.ref.detectChanges();
        }
      }, err => {
        console.error(err);
        this.loading.save = false;
        this.error.save = err.message ?? code.error.internal_server_error;
        this.ref.detectChanges();
      })
  }

  onSendEmailVerification() {
    if (!this.user) {
      return;
    }

    this.loading.verification_send = true;
    this.form.controls['email'].disable();
    this.ref.detectChanges();

    Auth.verifyCurrentUserAttribute('email')
      .then(() => {
        this.isOpenEmailVerificationForm = true;
        this.loading.verification_send = false;
        this.ref.detectChanges();
      })
      .catch(err => {
        this.loading.verification_send = false;
        this.error.resend = err.message ?? code.error.internal_server_error;
        this.ref.detectChanges();
      });
  }

  onSubmitEmailVerification() {
    if (this.loading.verification_submit) {
      return;
    }

    this.loading.verification_submit = true;
    this.ref.detectChanges();

    Auth.verifyCurrentUserAttributeSubmit('email', this.formConfirmation.controls['code'].value)
      .then(res => {
        if (res === 'SUCCESS') {
          this.loading.verification_submit = false;
          this.isOpenEmailVerificationForm = false;

          this.initEmail();
        }
      })
      .catch(err => {
        this.loading.verification_submit = false;
        this.error.verification_submit = err.message ?? code.error.internal_server_error;
        this.formConfirmation.markAsPristine();
        this.ref.detectChanges();
      })
  }
}
