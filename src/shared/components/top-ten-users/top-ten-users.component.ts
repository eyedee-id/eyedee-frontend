import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-top-ten-users',
  templateUrl: './top-ten-users.component.html',
  styleUrls: ['./top-ten-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopTenUsersComponent implements OnInit {

  top10users: Array<{ username: string }> = [];

  loading = {
    init: true,
  };

  constructor(
    private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.top10users = [
        {
          username: 'jokowi',
        },
        {
          username: 'pergijauh',
        },
        {
          username: 'najwa',
        },
        {
          username: 'wushh',
        },
        {
          username: 'sby',
        },
        {
          username: 'nikita',
        },
        {
          username: 'ariel',
        },
        {
          username: 'gilbertronaldo',
        },
        {
          username: 'admin',
        },
        {
          username: 'obama',
        }
      ];

      this.loading.init = false;
      this.ref.markForCheck();
    }, 1500);
  }

}
