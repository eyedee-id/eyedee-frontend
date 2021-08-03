import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-confide',
  templateUrl: './confide.component.html',
  styleUrls: ['./confide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
