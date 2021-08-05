import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ConfideModel} from '../models/confide.model';
import {ApiModel} from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serviceV1 = 'v1/user';

  constructor(
    private apiService: ApiService,
  ) {
  }

  userGet(username: string) {
    return this.apiService.get(this.serviceV1, `/${username}`);
  }

  userUpdateProfile(property: string, params: any) {
    if (property === 'name_') {
      property = 'name';
    }
    return this.apiService.post(this.serviceV1, `/${property}`, params);
  }
}
