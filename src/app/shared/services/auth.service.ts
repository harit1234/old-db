import { Injectable } from '@angular/core';
import { AuthState } from '../enums/auth-state.enum';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _state: AuthState = AuthState.INIT;
  jwtHelper = new JwtHelperService();
  public get state(): AuthState {
    return this._state;
  }

  private _stateChanged = new Subject<AuthState>();
  public stateChanged = this._stateChanged.asObservable();
  constructor() { }

  /**
   * Check if user is logged in or authenticated
   */
  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');
    if (token !== null) {
      // const expDate = this.jwtHelper.getTokenExpirationDate(token);
      // console.log(expDate)
      if (this.jwtHelper.isTokenExpired(token)) {
        console.log('Token Expired !!!');
      }
      return true;
    } else {
      // this.clearSession();
    }
    return false;
  }

  public get isLogged(): boolean {
    return this.state === AuthState.LOGGED_IN;
    // return this.isAuthenticated();
  }

  /**
   * Setting the credentials
   * @param userInfo json data of user response
   */
  public setCredentials(userInfo: any) {
    console.log('UserInfo:');
    console.log(userInfo);
    localStorage.setItem('userIdStorage', userInfo.data.username);
    localStorage.setItem('sessionIdStorage', userInfo.data.session_id);
    localStorage.setItem('token', userInfo.data.access_token);
    localStorage.setItem('email', userInfo.data.email);
    localStorage.setItem('apiSecretGenerated', userInfo.data.api_secret_generated);
    localStorage.setItem('walletAddress', JSON.stringify(userInfo.data.wallet_address));
    this.setState(AuthState.LOGGED_IN);
  }

  /**
   * Changing the auth state and throwing the observer
   * @param value different auth state
   */
  public setState(value: AuthState) {
    if (this.state !== value) {
      this._state = value;
      this._stateChanged.next(value);
    }
  }

  /**
   * Clearing all the local storage values
   */
  public clearSession() {
    localStorage.removeItem('userIdStorage');
    localStorage.removeItem('sessionIdStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('registerEmail');

    this.setState(AuthState.LOGGED_OUT);
  }

  public getAccessToken() {
    return localStorage.getItem('token');
  }
}
