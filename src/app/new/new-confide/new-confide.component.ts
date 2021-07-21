import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ConfideService} from '../../../shared/services/confide.service';
import {code} from '../../../shared/libs/code';

@Component({
  selector: 'app-new-confide',
  templateUrl: './new-confide.component.html',
  styleUrls: ['./new-confide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewConfideComponent implements OnInit, OnDestroy, AfterContentChecked {

  @Input()
  independent = true;

  confideMaxLength = 300;

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

  ngOnInit(): void {
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

    const value = this.formConfide.value;
    this.error.confide = null;
    this.loading.confide = true;
    this.formConfide.controls['text'].disable();
    this.ref.detectChanges();

    this.confideService.confideNew(value)
      .subscribe(res => {
        console.log(res);
        if (res.status) {
          this.router.navigate(['/explore']);
        } else {
          console.log(res.message);
          this.error.confide = res.message ?? code.error.internal_server_error;
          console.log(res.message);
        }

        this.formConfide.controls['text'].enable();
        this.loading.confide = false;
        this.ref.markForCheck();
      }, err => {
        this.formConfide.controls['text'].enable();
        this.loading.confide = false;
        this.error.confide = err.message ?? code.error.internal_server_error;
        this.ref.markForCheck();
      });

  }
}
