import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {onAuthUIStateChange} from '@aws-amplify/ui-components';
import {Auth} from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'eyedee-web';

  constructor(
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.isAuthenticated()
      .subscribe(res => {
      });

    this.authService.me()
      .subscribe(res => {
        console.log(res);
      })

    onAuthUIStateChange((authState, authData) => {
      this.authService.isAuthenticated();
      this.ref.detectChanges();
    })
  }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#global-spinner');
    this.renderer.setStyle(loader, 'display', 'none');
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
