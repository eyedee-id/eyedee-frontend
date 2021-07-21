import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthState, CognitoUserInterface} from '@aws-amplify/ui-components';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Auth} from 'aws-amplify';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
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
    return fromPromise(Auth.signUp(data.username, data.password, data.email));
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
    return fromPromise(Auth.currentSession())
      .pipe(
        switchMap(
          res => {
            return this.http.get('https://4x71706xqd.execute-api.ap-southeast-1.amazonaws.com/auth/v1/me', {
              headers: new HttpHeaders({
                Authorization: res.getIdToken().getJwtToken(),
              }),
            });
          }
        )
      )
  }
}
