import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#global-spinner');
    this.renderer.setStyle(loader, 'display', 'none');
  }
}
