import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Auth, CognitoUser} from "@aws-amplify/auth";
import {code} from "../../../../shared/libs/code";
import { decodeUTF8, encodeBase64} from "tweetnacl-util";
import { hash} from "tweetnacl";
import {aesEncryptData} from "../../../../shared/libs/aes";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-setting-security',
  templateUrl: './setting-security.component.html',
  styleUrls: ['./setting-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingSecurityComponent implements OnInit {

  user: CognitoUser | null = null;

  form = new FormGroup({
    password: new FormControl(null, {
      validators: [
        Validators.required,
      ]
    }),
    password_new: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
      ]
    }),
    password_new_confirmation: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(8),
        this.matchValues('password_new'),
      ]
    }),
  });

  error: any = {
    save: false,
  };

  loading = {
    save: false,
  };

  constructor(
    private ref: ChangeDetectorRef,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    Auth.currentAuthenticatedUser()
      .then(res => {

        this.user = res;
      })
  }

  matchValues(matchTo: string): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      // @ts-ignore
      return !!control.parent && !!control.parent.value && control.value === control.parent.controls[matchTo].value
        ? null
        : {isMatching: false};
    };
  }


  updatePassword() {
    if (this.form.invalid || this.loading.save || !this.user) {
      return;
    }

    const value = this.form.value;
    this.loading.save = true;
    this.ref.detectChanges();

    Auth
      .changePassword(this.user, value.password, value.password_new)
      .then(res => {
        console.log(res);


        // ganti secret Key User di Cognito berdasarkan password baru dia
        const secretKey = localStorage.getItem('user.secret_key');
        if (secretKey) {
          const aesEncrypted = aesEncryptData(
            secretKey,
            encodeBase64(hash(decodeUTF8(value.password_new))), // convert hashed password user ke base64
          );

          Auth
            .updateUserAttributes(this.user, {
              'custom:secret_key': aesEncrypted,
            })
            .then(() => {
              // logout
              this.authService.signOut();

            })
            .catch(err2 => {
              this.error.save = err2.message ?? code.error.internal_server_error;
              this.loading.save = false;
              this.ref.detectChanges();
            })
        } else {
          console.error('secret key tidak ada di user');
          this.error.save = code.error.error;
          this.loading.save = false;
          this.ref.detectChanges();
        }

      })
      .catch(err => {
        console.error(err);
        this.error.save = err.message ?? code.error.internal_server_error;
        this.loading.save = false;
        this.ref.detectChanges();
      })
  }
}
