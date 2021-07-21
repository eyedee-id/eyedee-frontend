import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashtagComponent implements OnInit {

  hashtag = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.hashtag = this.route.snapshot.params['hashtag'];
  }

}
