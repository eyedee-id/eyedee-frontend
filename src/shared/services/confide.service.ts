import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ConfideModel} from '../models/confide.model';
import {ApiModel} from '../models/api.model';

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

  confideExplore(params: any): Observable<ApiModel<Array<ConfideModel>>> {
    return this.apiService.get(this.serviceV1, '/explore', params);
  }

  confideUser(params: any): Observable<ApiModel<Array<ConfideModel>>> {
    return this.apiService.get(this.serviceV1, '/user', params);
  }
}
