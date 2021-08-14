import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-navigation-title',
  templateUrl: './navigation-title.component.html',
  styleUrls: ['./navigation-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTitleComponent {

  @Input()
  title: string | null = null;

  @Input()
  routerLink: string | null = null;

  constructor() {
  }

}
