import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  OnInit,
  Renderer2
} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {

  theme = 'light';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    public authService: AuthService,
  ) {

    const theme = localStorage.getItem('client.theme');
    if (
      theme
      && (theme === 'light' || theme === 'dark')
    ) {
      this.theme = theme;
    }

    this.document.body.classList.add(this.theme);
  }

  ngOnInit() {
    this.authService.isAuthenticated()
      .subscribe(async () => {
      });
  }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#global-spinner');
    this.renderer.setStyle(loader, 'display', 'none');
  }
}
