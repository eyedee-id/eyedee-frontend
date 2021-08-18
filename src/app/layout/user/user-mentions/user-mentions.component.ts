import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-user-mentions',
  templateUrl: './user-mentions.component.html',
  styleUrls: ['./user-mentions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMentionsComponent {

  constructor() {
  }

}
