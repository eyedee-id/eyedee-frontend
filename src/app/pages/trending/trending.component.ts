import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
