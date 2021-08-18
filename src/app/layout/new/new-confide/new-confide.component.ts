import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, Input,
  OnDestroy
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ConfideService} from '../../../../shared/services/confide.service';
import {code} from '../../../../shared/libs/code';
import {box, randomBytes, secretbox} from "tweetnacl";
import {decodeBase64, decodeUTF8, encodeBase64} from "tweetnacl-util";
import {nanoid} from 'nanoid';

@Component({
  selector: 'app-new-confide',
  templateUrl: './new-confide.component.html',
  styleUrls: ['./new-confide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewConfideComponent implements OnDestroy, AfterContentChecked {

  @Input()
  independent = true;

  confideMaxLength = 3000;

  formConfide = new FormGroup({
    is_anonim: new FormControl(false),
    text: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(this.confideMaxLength),
      ]
    }),
  });

  loading = {
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
    confide: null,
  };

  constructor(
    private elRef: ElementRef,
    private ref: ChangeDetectorRef,
    private router: Router,
    private confideService: ConfideService,
  ) {
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

  confideSubmit() {
    if (this.formConfide.invalid) {
      return;
    }

    this.error.confide = null;
    this.loading.confide = true;
    this.formConfide.controls['text'].disable();
    this.ref.detectChanges();

    let data = {};

    let nonce = null;
    let messageEncrypted = null;
    if (this.formConfide.controls['is_anonim'].value) {

      // @TODO: ini sementara, nanti akan di ganti pakai indexedDB / web crypto api
      const secretKey = localStorage.getItem('user.secret_key');
      if (secretKey) {

        // kalau anonim, generate id nya dari frontend, karna akan di enkripsi masuk backend
        data = {
          at_created: +(new Date()),
          confide_id: nanoid(32),
        };

        const messageToEncrypt = {
          ...data,
          text: this.formConfide.controls['text'].value,
        }

        nonce = encodeBase64(randomBytes(box.nonceLength));
        const cipherText = secretbox(
          decodeUTF8(JSON.stringify(messageToEncrypt)),
          decodeBase64(nonce),
          decodeBase64(secretKey),
        );

        messageEncrypted = encodeBase64(cipherText);
      }
    }


    this.confideService.confideNew({
      public: {
        ...data,
        is_anonim: this.formConfide.controls['is_anonim'].value,
        text: this.formConfide.controls['text'].value,
      },
      private: {
        type: 'secretbox',
        message: messageEncrypted,
        nonce: nonce,
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
