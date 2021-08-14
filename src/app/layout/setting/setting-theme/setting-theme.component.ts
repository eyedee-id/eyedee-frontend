import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-setting-theme',
  templateUrl: './setting-theme.component.html',
  styleUrls: ['./setting-theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingThemeComponent implements OnInit {

  theme = 'light';

  constructor() {
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('client.theme');
    if (
      theme
      && (theme === 'light' || theme === 'dark')
    ) {
      this.theme = theme;
    }
  }

  changeTheme(themeNew: string) {
    document.body.classList.replace(this.theme, themeNew);
    localStorage.setItem('client.theme', themeNew);
  }

}
