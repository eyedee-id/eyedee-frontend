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

  confideDetail(confideId: string): Observable<ApiModel<ConfideModel>> {
    return this.apiService.get(this.serviceV1, `/${confideId}`);
  }

  confideExplore(params: any): Observable<ApiModel<Array<ConfideModel>>> {
    return this.apiService.get(this.serviceV1, '/explore', params);
  }

  confideHashtag(hashtag: string | null, params: any): Observable<ApiModel<Array<ConfideModel>>> {
    return this.apiService.get(this.serviceV1, `/hashtag/${hashtag}`, params);
  }

  confideUser(params: any): Observable<ApiModel<Array<ConfideModel>>> {
    return this.apiService.get(this.serviceV1, '/user', params);
  }

  confideComments(confideId: string, params: any) {
    return this.apiService.get(this.serviceV1, `/${confideId}/comment`, params);
  }

  confideCommentNew(confideId: string, data: any) {
    return this.apiService.put(this.serviceV1, `/${confideId}/comment`, data);
  }
}
