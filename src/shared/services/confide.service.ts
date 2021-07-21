import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfideService {

  private serviceV1 = 'v1/confide';

  constructor(
    private apiService: ApiService,
  ) {
  }

  confideNew(data: any) {
    return this.apiService.put(this.serviceV1, '', data);
  }

  confideExplore(params: any) {
    return this.apiService.get(this.serviceV1, '/explore', params);
  }
}
