import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserModel} from "../../../../shared/models/user.model";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  styleUrls: ['./setting-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent implements OnInit {

  user: UserModel | undefined;

  form = new FormGroup({
    name: new FormControl(null),
    bio: new FormControl(null),
  })

  constructor() { }

  ngOnInit(): void {
  }

}
