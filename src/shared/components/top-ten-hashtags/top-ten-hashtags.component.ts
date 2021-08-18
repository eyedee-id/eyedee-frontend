import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-top-ten-hashtags',
  templateUrl: './top-ten-hashtags.component.html',
  styleUrls: ['./top-ten-hashtags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopTenHashtagsComponent implements OnInit {

  top10hashtags: Array<string> = [];

  loading = {
    init: true,
  };

  constructor(
    private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.top10hashtags = ['bantuindonesia', 'keuangan', 'milenial', 'covid19', 'ppkm', 'indonesia', 'cinta', 'pernikahandini', 'rezaarab', 'instagram'];
      this.loading.init = false;
      this.ref.markForCheck();
    }, 1000);
  }

}
