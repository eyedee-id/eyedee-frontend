import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, ViewChild,
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

  @ViewChild('userBanner', {static: false}) userBanner: ElementRef<any> | undefined;


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

  error: any = {
    user: null,
    save: {
      name_: null,
      bio: null,
    },
    upload_photo_pre: null,
  };

  loading = {
    user: false,
    save: {
      name_: false,
      bio: false,
    },
    upload_photo_pre: false,
  };

  subscription: any = {
    user: null,
    save: {
      name: null,
      bio: null,
    },
    upload_photo_pre: null,
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
          this.user = res.data as UserModel;

          this.form.controls['name_'].patchValue(this.user.name_);
          this.form.controls['bio'].patchValue(this.user.bio);
        } else {
          this.error.user = res.message ?? code.error.internal_server_error;
        }

        this.loading.user = false;
        this.ref.detectChanges();

        if (this.user && this.user.banner_url) {
          const banner = this.userBanner?.nativeElement;
          if (banner) {
            banner.setAttribute('style', `background-image: url("${this.user.banner_url}"); background-position: center calc(50%);`);
          }
        }

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

  uploadPhoto(photoType: 'profile' | 'banner', event: Event) {
    const element = event.target as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files?.length !== 1) {
      return;
    }

    const file = files[0];
    const fileExtension = file.type.replace(/(.*)\//g, '').toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      this.error.upload_photo_pre = 'file gambar aja yang boleh upload! (jpg/jpeg/png)';
      return;
    }

    if (this.loading.upload_photo_pre) {
      return;
    }

    if (this.subscription.upload_photo_pre && !this.subscription.upload_photo_pre.closed) {
      this.subscription.upload_photo_pre.unsubscribe();
    }

    this.loading.upload_photo_pre = true;
    this.error.upload_photo_pre = null;
    this.ref.markForCheck();

    let data: any = {
      photo_type: photoType,
      type: file.type,
      extension: fileExtension,
    };

    this.userService
      .userUploadPhotoProfile(data)
      .subscribe(async res => {
        if (!res.status) {
          this.error.upload_photo_pre = res.message ?? code.error.internal_server_error;
          this.loading.upload_photo_pre = false;
          this.ref.markForCheck();
          return;
        }

        try {
          console.log(res.data, file);
          await this.uploadFileToS3(res.data, file);
          console.log("File was successfully uploaded!");

          this.getUser();
        } catch (e) {
          this.error.upload_photo_pre = e;
          console.log(e);
        }

        this.loading.upload_photo_pre = false;
        this.ref.detectChanges();

      }, err => {
        this.error.upload_photo_pre = err.message ?? code.error.internal_server_error;
        this.loading.upload_photo_pre = false;
        this.ref.detectChanges();
      });
  }

  uploadFileToS3(preSignedPostData: any, file: File) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(preSignedPostData.field).forEach(key => {
        formData.append(key, preSignedPostData.field[key]);
      });
      // Actual file has to be appended last.
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", preSignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function () {
        this.status === 204 ? resolve(true) : reject(this.responseText);
      };
    });
  };
}
