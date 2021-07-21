import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navigation-bottom',
  templateUrl: './navigation-bottom.component.html',
  styleUrls: ['./navigation-bottom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBottomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
