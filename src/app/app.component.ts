import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'eyedee-web';

  constructor(
    public authService: AuthService,
  ) {
  }
}
