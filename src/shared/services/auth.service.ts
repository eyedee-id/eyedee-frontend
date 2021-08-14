import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Auth} from '@aws-amplify/auth';
import {ApiService} from './api.service';
import {UserModel} from "../models/user.model";
import {aesDecryptData, aesEncryptData} from "../libs/aes";
import {decodeUTF8, encodeBase64} from "tweetnacl-util";
import {box, hash} from "tweetnacl";


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
        catchError(() => {
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
        () => {
          localStorage.clear();
          this.loggedIn.next(false);
          this.router.navigate(['/']);
        },
        error => console.error(error)
      );
  }

  /** signup */
  public signUp(data: { username: string, password: string, email: string, attributes: {} }): Observable<any> {
    return fromPromise(Auth.signUp({
      username: data.username,
      password: data.password,
      attributes: {
        // email: data.email,
        ...data.attributes,
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
  public signIn(username: string, password: string): Observable<any> {
    return fromPromise(Auth.signIn(username, password))
      .pipe(
        tap(res => {

          if (
            res.attributes['custom:public_key']
            && res.attributes['custom:secret_key']
          ) {

            const aesDecrypted = aesDecryptData(
              res.attributes['custom:secret_key'],
              encodeBase64(hash(decodeUTF8(password))), // convert hashed password user ke base64
            );

            // @TODO: ini sementara, nanti akan di ganti pakai indexedDB / web crypto api
            localStorage.setItem('user.public_key', res.attributes['custom:public_key']);
            localStorage.setItem('user.secret_key', aesDecrypted);

            return this.loggedIn.next(true);
          }

          // create new encryption key bagi yang belom punya

          const userKeyPair = box.keyPair();

          const aesEncrypted = aesEncryptData(
            encodeBase64(userKeyPair.secretKey), // convert secret ke base64
            encodeBase64(hash(decodeUTF8(password))), // convert hashed password user ke base64
          );

          Auth
            .updateUserAttributes(res, {
              'custom:public_key': encodeBase64(userKeyPair.publicKey),
              'custom:secret_key': aesEncrypted,
            })
            .then(() => {
              localStorage.setItem('user.public_key', encodeBase64(userKeyPair.publicKey));
              localStorage.setItem('user.secret_key', encodeBase64(userKeyPair.secretKey));

              return this.loggedIn.next(true);
            }, () => {
              return this.loggedIn.next(false);
            })

        })
      );
  }

  me() {
    return this.apiService.get(this.serviceV1, '/me');
  }
}
