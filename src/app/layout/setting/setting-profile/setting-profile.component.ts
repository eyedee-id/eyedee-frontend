import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {UserModel} from "../../../../shared/models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../shared/services/user.service";
import {code} from "../../../../shared/libs/code";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  styleUrls: ['./setting-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent implements OnInit, OnDestroy, AfterContentChecked {

  user: UserModel | undefined;

  form = new FormGroup({
    name_: new FormControl(null, {
      validators: [
        Validators.maxLength(50),
      ]
    }),
    bio: new FormControl(null, {
      validators: [
        Validators.maxLength(300),
      ]
    }),
  })

  error = {
    user: null,
    save: {
      name_: null,
      bio: null,
    }
  };

  loading = {
    user: false,
    save: {
      name_: false,
      bio: false,
    }
  };

  subscription: any = {
    user: null,
    save: {
      name: null,
      bio: null,
    }
  }

  constructor(
    private elRef: ElementRef,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy() {
    if (this.subscription.user) {
      this.subscription.user.unsubscribe();
    }

    if (this.subscription.save.name) {
      this.subscription.save.name.unsubscribe();
    }

    if (this.subscription.save.bio) {
      this.subscription.save.bio.unsubscribe();
    }
  }

  ngAfterContentChecked() {
    this.textAreaAutoExpand();
  }

  textAreaAutoExpand() {
    const textAreas = this.elRef.nativeElement.querySelectorAll('textarea');
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].style.height = textAreas[i].scrollHeight + 'px';
    }
  }

  getUser() {
    if (this.loading.user) {
      return;
    }

    if (this.subscription.user && !this.subscription.user.closed) {
      this.subscription.user.unsubscribe();
    }

    this.loading.user = true;
    this.ref.markForCheck();


    const username = (this.authService.user?.username || '');
    this.subscription.user = this.userService.userGet(username)
      .subscribe(res => {
        if (res.status) {
          // res.data.avatar_url = 'https://nos3.arkjp.net/?url=https%3A%2F%2Fimg.pawoo.net%2Faccounts%2Favatars%2F000%2F748%2F032%2Foriginal%2F0c1478df964637b8.jpeg&thumbnail=1';
          res.data.banner_url = 'https://nos3.arkjp.net/?url=https%3A%2F%2Fstorage.googleapis.com%2Fyysk.icu%2Faccounts%2Fheaders%2F000%2F000%2F001%2Foriginal%2Fdc4961291058cb6f.jpg';
          this.user = res.data as UserModel;

          this.form.controls['name_'].patchValue(this.user.name_);
          this.form.controls['bio'].patchValue(this.user.bio);
        } else {
          this.error.user = res.message ?? code.error.internal_server_error;
        }

        this.loading.user = false;
        this.ref.detectChanges();

        this.textAreaAutoExpand();
      }, err => {
        this.error.user = err.message ?? code.error.internal_server_error;
        this.loading.user = false;
        this.ref.detectChanges();
      });
  }

  updateProfile(property: 'name_' | 'bio') {
    if (
      this.form.controls[property].invalid
      || this.loading.save[property]
    ) {
      return;
    }

    if (this.subscription.save[property] && !this.subscription.save[property].closed) {
      this.subscription.save[property].unsubscribe();
    }

    this.loading.save[property] = true;
    this.error.save[property] = null;
    this.ref.markForCheck();

    let params: any = {};
    params[property] = this.form.controls[property].value;

    this.userService
      .userUpdateProfile(property, params)
      .subscribe(res => {
        if (res.status) {
          this.form.controls[property].markAsPristine();
          this.form.controls[property].markAsUntouched();
        } else {
          this.error.save[property] = res.message ?? code.error.internal_server_error;
        }

        this.loading.save[property] = false;
        this.ref.markForCheck();
      }, err => {
        this.error.save[property] = err.message ?? code.error.internal_server_error;
        this.loading.save[property] = false;
        this.ref.detectChanges();
      });
  }

}
