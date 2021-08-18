import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {Auth, CognitoUser} from "@aws-amplify/auth";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent implements OnInit {

  user: CognitoUser | null = null;

  email = {
    not_set: false,
    not_verified: false,
  }

  constructor(
    private ref: ChangeDetectorRef,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    Auth.currentUserInfo()
      .then(res => {

        this.user = res;
        if (res.attributes) {
          this.email.not_set = !res.attributes.email;
          this.email.not_verified = !res.attributes.email_verified;
        }

        this.ref.detectChanges();
      })
  }

}
