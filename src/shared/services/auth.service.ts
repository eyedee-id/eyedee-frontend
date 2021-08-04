import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Auth} from '@aws-amplify/auth';
import {ApiService} from './api.service';
import {UserModel} from "../models/user.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;
  public user: UserModel | null = null;

  private serviceV1 = 'v1/auth';

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.user = {
            user_id: result?.attributes?.sub,
            username: result?.username
          };

          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.user = null;
          this.loggedIn.next(false);
          return of(false);
        })
      );
  }

  /** signout */
  public signOut() {
    fromPromise(Auth.signOut())
      .subscribe(
        result => {
          this.loggedIn.next(false);
          this.router.navigate(['/']);
        },
        error => console.log(error)
      );
  }

  /** signup */
  public signUp(data: { username: string, password: string, email: string }): Observable<any> {
    return fromPromise(Auth.signUp({
      username: data.username,
      password: data.password,
      attributes: {
        email: data.email,
      }
    }));
  }

  /** confirm code */
  public resendSignUp(email: string): Observable<any> {
    return fromPromise(Auth.resendSignUp(email));
  }

  /** confirm code */
  public confirmSignUp(email: string, code: string): Observable<any> {
    return fromPromise(Auth.confirmSignUp(email, code));
  }

  /** signin */
  public signIn(email: string, password: string): Observable<any> {
    return fromPromise(Auth.signIn(email, password))
      .pipe(
        tap(() => this.loggedIn.next(true))
      );
  }

  me() {
    return this.apiService.get(this.serviceV1, '/me');
  }
}
