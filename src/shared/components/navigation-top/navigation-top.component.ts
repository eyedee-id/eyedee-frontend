import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrls: ['./navigation-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTopComponent {

  constructor(
    // public authService: AuthService,
  ) { }

}
