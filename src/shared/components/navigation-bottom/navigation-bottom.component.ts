import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navigation-bottom',
  templateUrl: './navigation-bottom.component.html',
  styleUrls: ['./navigation-bottom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBottomComponent {

  constructor(
    public authService: AuthService,
  ) { }

}
