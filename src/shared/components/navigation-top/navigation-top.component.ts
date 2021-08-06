import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrls: ['./navigation-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTopComponent {

  constructor(
    public authService: AuthService,
  ) { }

}
