import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendingComponent {

  constructor() { }

}
