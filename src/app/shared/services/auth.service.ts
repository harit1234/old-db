import { Injectable } from '@angular/core';
import { AuthState } from '../enums/auth-state.enum';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _state: AuthState = AuthState.INIT;

  public get state(): AuthState {
    return this._state;
  }

  private _stateChanged = new Subject<AuthState>();
  public stateChanged = this._stateChanged.asObservable();
  constructor() { }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');
    return token !== null;
    // Check whether the token is expired and return
    // true or false
    // return !this.jwtHelper.isTokenExpired(token);
  }

  public setCredentials(userInfo: any) {
      console.log('UserInfo:');
      console.log(userInfo);
      localStorage.setItem('userIdStorage', userInfo.username);
      localStorage.setItem('sessionIdStorage', userInfo.session_id);
      localStorage.setItem('token', userInfo.access_token);
      localStorage.setItem('email', userInfo.email);
      this.setState(AuthState.LOGGED_IN);
  }

  public setState(value: AuthState) {
    if (this.state !== value) {
      this._state = value;
      this._stateChanged.next(value);
    }
  }

  public clearSession() {
      localStorage.removeItem('userIdStorage');
      localStorage.removeItem('sessionIdStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('email');

    this.setState(AuthState.LOGGED_OUT);
  }
}
