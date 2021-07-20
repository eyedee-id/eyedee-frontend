import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {onAuthUIStateChange, CognitoUserInterface} from '@aws-amplify/ui-components';
import {Auth} from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eyedee-web';

  constructor(
    private ref: ChangeDetectorRef,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.isAuthenticated()
      .subscribe(res => {
      });

    onAuthUIStateChange((authState, authData) => {
      this.authService.isAuthenticated();
      this.ref.detectChanges();
    })
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
