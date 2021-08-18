import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  constructor(
    public authService: AuthService,
  ) { }

}
