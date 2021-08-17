import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, Input,
  OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router, RouterEvent} from '@angular/router';
import {decodeBase64, decodeUTF8, encodeBase64} from "tweetnacl-util";
import {nanoid} from 'nanoid';
import {ConfideService} from "../../../shared/services/confide.service";
import {code} from "../../../shared/libs/code";
import {UserService} from "../../../shared/services/user.service";
import {sealBox} from "../../../shared/libs/seal";
import {UserModel} from "../../../shared/models/user.model";
import {findAndReplaceHashTag} from "../../../shared/libs/hashtag";

@Component({
  selector: 'app-confide-to-user',
  templateUrl: './confide-to-user.component.html',
  styleUrls: ['./confide-to-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfideToUserComponent implements OnInit, OnDestroy, AfterContentChecked {

  @ViewChild('userBanner', {static: false}) userBanner: ElementRef<any> | undefined;

  @Input()
  independent = true;

  username: string = '';
  user: UserModel | null = null;

  confideMaxLength = 3000;

  formConfide = new FormGroup({
    text: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(this.confideMaxLength),
      ]
    }),
  });

  loading = {
    user: false,
    confide: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    confide: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    router_events: null,
    username: null,
    user: null,
    confide: null,
  };

  constructor(
    private elRef: ElementRef,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private confideService: ConfideService,
  ) {
  }

  ngOnInit() {
    this.subscription.router_events = this.router.events
      .subscribe(res => {
        if (res.constructor.name === 'NavigationStart') {
          if ((res as RouterEvent).url.split('/')[1] === this.username) {
            this.getUser();
          }
        }
      })

    this.subscription.username = this.route.params.subscribe(res => {
      this.username = res.username;
      this.getUser();
      this.ref.markForCheck();
    })
  }

  ngAfterContentChecked() {
    const textAreas = this.elRef.nativeElement.querySelectorAll('textarea');
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].style.height = textAreas[i].scrollHeight + 'px';
    }
  }

  ngOnDestroy() {
    if (this.subscription.confide) {
      this.subscription.confide.unsubscribe();
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

    this.subscription.user = this.userService.userGetAnonim(this.username)
      .subscribe(res => {
        if (res.status) {

          res.data.bio = findAndReplaceHashTag(res.data.bio);
          this.user = res.data as UserModel;
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
      }, err => {
        console.error(err);
        this.error.user = err.message ?? code.error.internal_server_error;
        this.loading.user = false;
        this.ref.detectChanges();
      });
  }

  onClickUserBio(event: any) {
    let hashtagRoute = event.target.attributes.value?.value;
    if (hashtagRoute) {
      this.router.navigate([hashtagRoute]);
    }
  }

  confideSubmit() {
    if (this.formConfide.invalid || !this.user || !this.user.public_key) {
      return;
    }

    this.error.confide = null;
    this.loading.confide = true;
    this.formConfide.controls['text'].disable();
    this.ref.detectChanges();

    // kalau anonim, generate id nya dari frontend, karna akan di enkripsi masuk backend
    let data = {
      at_created: +(new Date()),
      confide_id: nanoid(32),
    };

    const messageToEncrypt = {
      ...data,
      text: this.formConfide.controls['text'].value,
    }

    const sealed = sealBox(
      decodeUTF8(JSON.stringify(messageToEncrypt)),
      decodeBase64(this.user.public_key),
    );

    const messageEncrypted = encodeBase64(sealed);

    this.confideService.confideNewAnonim({
      public: {
        ...data,
        is_anonim: true,
        text: this.formConfide.controls['text'].value,
      },
      private: {
        user_id: this.user.user_id,
        message: messageEncrypted,
        type: 'sealedbox',
      },
    })
      .subscribe(res => {
        if (res.status) {
          this.router.navigate(['/explore']);
        } else {
          this.error.confide = res.message ?? code.error.internal_server_error;
          this.formConfide.controls['text'].enable();
          this.loading.confide = false;
          this.ref.markForCheck();
        }
      }, err => {
        this.formConfide.controls['text'].enable();
        this.loading.confide = false;
        this.error.confide = err.message ?? code.error.internal_server_error;
        this.ref.markForCheck();
      });

  }
}
