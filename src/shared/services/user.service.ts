import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

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

  userUploadPhotoProfile(data: any) {
    return this.apiService.post(this.serviceV1, `/photo`, data);
  }
}
