import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit, OnDestroy, AfterContentChecked {

  confideMaxLength = 300;

  confides: Array<{
    id: number | string,
    name: string,
    username: string,
    at_created: string,
    photo_url?: string,
    total_comment?: number,
    text: string,
    hashtags?: Array<string>,
  }> = [];

  formConfide = new FormGroup({
    text: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(this.confideMaxLength),
      ]
    })
  });

  loading = {
    confide: false,
    confides: true,
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
    confides: null,
  };

  destroy = new Subject();

  destroy$ = this.destroy.asObservable();

  constructor(
    private elRef: ElementRef,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      let confides = [
        {
          id: '14g',
          name: 'Jokowi Dodo',
          username: 'jokowi',
          at_created: '1 days ago',
          photo_url: 'https://cdn.dribbble.com/users/4167412/avatars/small/65dd329f0993a84b4a325abce6337b7c.png?1625924074',
          total_comment: 3,
          text: 'The time to move forward is now',
          hashtags: ['indonesia', 'ppkm', 'covid19']
        },
        {
          id: '14h',
          name: 'Mas Bro',
          username: 'masbro',
          at_created: '2 days ago',
          total_comment: 5,
          text: ` Tidak seperti anggapan banyak orang, Lorem Ipsum bukanlah teks-teks yang diacak. Ia berakar dari sebuah
              naskah sastra latin klasik dari era 45 sebelum masehi, hingga bisa dipastikan usianya telah mencapai lebih
              dari 2000 tahun.`,
          hashtags: ['lorem']
        },
        {
          id: '14j',
          name: 'Gilbert',
          username: 'gilbert',
          at_created: '2 days ago',
          total_comment: 9,
          text: 'Ada banyak variasi tulisan Lorem Ipsum yang tersedia, tapi kebanyakan sudah mengalami perubahan bentuk, entah karena unsur humor atau kalimat yang diacak hingga nampak sangat tidak masuk akal. Jika anda ingin menggunakan tulisan Lorem Ipsum, anda harus yakin tidak ada bagian yang memalukan yang tersembunyi di tengah naskah tersebut.',
        },
        {
          id: '14l',
          name: 'SBY',
          username: 'ronaldo',
          at_created: '4 days ago',
          total_comment: 7,
          text: 'Sudah merupakan fakta bahwa seorang pembaca akan terpengaruh oleh isi tulisan dari sebuah halaman saat ia melihat tata letaknya.',
          hashtags: ['curhat'],
        }
      ];

      confides = [...confides, ...confides, ...confides];

      this.confides = confides.map((i, idx) => {
        return {
          ...i,
          id: idx + 1,
        }
      });

      this.loading.confides = false;
      this.ref.detectChanges();

      this.initAutoScroll();
    }, 3000);
  }

  public trackById(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    if (this.subscription.confide) {
      this.subscription.confide.unsubscribe();
    }

    this.destroy.next();
  }

  ngAfterContentChecked() {
    const textAreas = this.elRef.nativeElement.querySelectorAll('textarea');
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].style.height = textAreas[i].scrollHeight + 'px';
    }
  }

  confideSubmit() {
    if (this.formConfide.invalid) {
      return;
    }

    this.loading.confide = true;
    this.formConfide.controls['text'].disable();
    this.ref.detectChanges();

    // this.authService.login(this.formConfide.value)
    //   .subscribe(res => {
    //     this.loading.confide = false;
    //   }, () => {
    //     this.loading.confide = false;
    //     this.error.confide = code.error.internal_server_error;
    //     this.formConfide.controls['text'].enable();
    //     this.formConfide.markAsPristine();
    //     this.ref.detectChanges();
    //   })
  }

  initAutoScroll() {
    const main = document.getElementsByTagName('main').item(0) ?? null;
    console.log(main);
    if (main) {

      fromEvent(main, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: Event) => {
          if ((e.target as Element).scrollTop >= ((e.target as Element).scrollHeight - (e.target as Element).clientHeight)) {
            this.getConfides();
            return;
          }
        });
    }
  }

  getConfides() {
    if (this.loading.confides) {
      return;
    }

    console.log('get confides');
    this.loading.confides = true;
    this.ref.markForCheck();

    setTimeout(() => {
      const confides = [...this.confides, ...this.confides, ...this.confides];

      this.confides = confides.map((i, idx) => {
        return {
          ...i,
          id: idx + 1,
        }
      });

      this.loading.confides = false;
      this.ref.markForCheck();

    }, 2000);
  }
}
