import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Auth} from '@aws-amplify/auth';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 apiUrl;

  constructor(
    private http: HttpClient,
  ) {
    this.apiUrl = environment.api.url;
  }

  generateApiUrl(service: string, url: string) {
    return `${this.apiUrl}/${service}${url}`;
  }

  get(service: string, url: string, params: any = {}, auth = true, options: {
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
  } = {}): Observable<any> {
    const apiUrl = this.generateApiUrl(service, url);

    if (auth) {
      return fromPromise(Auth.currentSession())
        .pipe(switchMap(res => {

            const $params = new HttpParams({
              fromObject: params,
            });

            // @ts-ignored
            return this.http.get<any>(apiUrl, {
              headers: new HttpHeaders({
                'Authorization': 'Bearer ' + res.getIdToken().getJwtToken(),
              }),
              params: $params,
              ...options,
            });
          }),
        );
    }

    const $params = new HttpParams({
      fromObject: params,
    });

    // @ts-ignored
    return this.http.get<any>(apiUrl, {
      params: $params,
      ...options,
    });
  }

  post(service: string, url: string, body: any = {}, auth = true, options: {
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
  } = {}): Observable<any> {
    const apiUrl = this.generateApiUrl(service, url);
    return fromPromise(Auth.currentSession())
      .pipe(switchMap(res => {

          // @ts-ignore
          return this.http.post<any>(apiUrl, body, {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + res.getIdToken().getJwtToken(),
            }),
            ...options,
          });
        }),
      );
  }

  patch(service: string, url: string, body: any = {}, auth = true): Observable<any> {
    const apiUrl = this.generateApiUrl(service, url);
    return fromPromise(Auth.currentSession())
      .pipe(switchMap(res => {
          return this.http.patch<any>(apiUrl, body, {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + res.getIdToken().getJwtToken(),
            }),
          });
        }),
      );
  }

  put(service: string, url: string, body: any = {}, auth = true): Observable<any> {
    const apiUrl = this.generateApiUrl(service, url);
    if (auth) {
      return fromPromise(Auth.currentSession())
        .pipe(switchMap(res => {
            return this.http.put<any>(apiUrl, body, {
              headers: new HttpHeaders({
                'Authorization': 'Bearer ' + res.getIdToken().getJwtToken(),
              }),
            });
          }),
        );
    }

    return this.http.put<any>(apiUrl, body, {});
  }

  delete(service: string, url: string) {
    const apiUrl = this.generateApiUrl(service, url);
    return fromPromise(Auth.currentSession())
      .pipe(switchMap(res => {
          return this.http.delete<any>(apiUrl, {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + res.getIdToken().getJwtToken(),
            }),
          });
        }),
      );
  }
}
