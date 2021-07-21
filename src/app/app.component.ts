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
import {Auth} from '@aws-amplify/auth';

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
      .subscribe(async () => {
      });

    // this.authService.me()
    //   .subscribe(res => {
    //     console.log(res);
    //   })

  }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#global-spinner');
    this.renderer.setStyle(loader, 'display', 'none');
  }

  ngOnDestroy() {
  }
}
