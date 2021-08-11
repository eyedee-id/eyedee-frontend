import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {Router} from "@angular/router";
import {ConfideService} from "../../../../shared/services/confide.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {code} from "../../../../shared/libs/code";
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentNewComponent implements OnDestroy, AfterContentChecked {

  @Input()
  confideId: string = '';

  @Output()
  commentCreated = new EventEmitter<boolean>();

  commentMaxLength = 3000;
  comment = null;
  formComment = new FormGroup({
    is_anonim: new FormControl(false),
    text: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(this.commentMaxLength),
      ]
    }),
  })

  loading = {
    confide: false,
    comment: false,
  };

  error: {
    [key: string]: null | string,
  } = {
    confide: null,
    comment: null,
  };

  subscription: {
    [key: string]: null | Subscription,
  } = {
    confide_id: null,
    confide: null,
    comment: null,
  };

  constructor(
    private elRef: ElementRef,
    private ref: ChangeDetectorRef,
    private router: Router,
    private confideService: ConfideService,
  ) {
  }


  ngOnDestroy() {
    if (this.subscription.comment) {
      this.subscription.comment.unsubscribe();
    }
  }

  ngAfterContentChecked() {
    const textAreas = this.elRef.nativeElement.querySelectorAll('textarea');
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].style.height = textAreas[i].scrollHeight + 'px';
    }
  }

  commentCancel() {
    this.error.comment = null;
    this.loading.comment = false;
    this.formComment.controls['text'].enable();
    this.formComment.reset();
  }


  commentSubmit() {
    if (
      !this.confideId
      || this.confideId === ''
      || this.formComment.invalid) {
      return;
    }

    const value = this.formComment.value;
    this.error.comment = null;
    this.loading.comment = true;
    this.formComment.controls['text'].disable();
    this.ref.detectChanges();

    this.confideService.confideCommentNew(this.confideId, value)
      .subscribe(res => {
        console.log(res);
        if (res.status) {
          this.commentCreated.emit(true);
        } else {
          this.error.comment = res.message ?? code.error.internal_server_error;
          this.formComment.controls['text'].enable();
          this.loading.comment = false;
          this.ref.markForCheck();
        }
      }, err => {
        this.formComment.controls['text'].enable();
        this.loading.comment = false;
        this.error.comment = err.message ?? code.error.internal_server_error;
        this.ref.markForCheck();
      });
  }
}
