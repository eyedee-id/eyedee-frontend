import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * @todo: dummy auth
   */
  user: null | boolean = null;

  constructor(
    private http: HttpClient,
  ) {
  }

  login(
    data: {
      username: string,
      password: string,
    }
  ) {
    return this.http.post('', data);
  }

  register(
    data: {
      username: string,
      password: string,
    }
  ) {
    return this.http.post('', data);
  }
}
