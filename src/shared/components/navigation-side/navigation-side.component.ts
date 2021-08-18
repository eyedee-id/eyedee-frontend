import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-navigation-side',
  templateUrl: './navigation-side.component.html',
  styleUrls: ['./navigation-side.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSideComponent {

  notificationTotal = 10;

  constructor() {
  }

}
