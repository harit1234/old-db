import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { AppConfig } from '../../app.config';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  private EQUAL = '=';
  private AMP = '&';
  private loginUrl = 'login';
  private registerUrl = 'register';
  private resendVerificationUrl = 'resend_verification_email';
  private forgotPasswordUrl = 'forgot_password';
  private logoutUrl = 'logout';
  private userInfoUrl = 'userinfo';
  private refreshTokenUrl = 'refreshToken';
  private resetPasswordUrl = 'reset_password';
  private activateAccountUrl = 'activate_account';
  private changePasswordUrl = 'change_password';
  private google2faStatusUrl = 'google_2fa_status';

  constructor(private http: HttpClient) {

  }
  private post_request(url: string, data): Observable<string> {
    // const formData = Object.keys(data)
    //   .map(key => Array.isArray(data[key])
    //     ? data[key].map(value => key + this.EQUAL + encodeURIComponent(ng g s guards/authGuard --spec falsevalue)).join(this.AMP)
    //     : key + this.EQUAL + encodeURIComponent(data[key])
    //   ).join(this.AMP);
    //  console.log('post_request: ', url, ', ', data);
    return this.http.post<any>(environment.restUrl + url, data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }).pipe(map(d => {
        return d;
      }),
        catchError((err, caught) => {
          return throwError(
            `${err}`);
        })
      );
  }

  private get_request(url: string): Observable<any> {

    return this.http.get(environment.restUrl + url,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }).pipe(map(d => {
        return d;
      }),
        catchError((err, caught) => {
          console.log(err);
          return throwError(
            `Error: ${err}`);
        })
      );
  }

  private put_request(url: string, data): Observable<string> {

    return this.http.put<any>(environment.restUrl + url, data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }).pipe(map(d => {
        return d;
      }),
        catchError((err, caught) => {
          return throwError(
            `${err}`);
        })
      );
  }

  login(data: any): Observable<any> {
    console.log(data);
    for (const i in data) {
      if (!data[i]) {
        delete data[i];
      }
    }

    console.log('login attempt:', JSON.stringify(data));
    return this.post_request(this.loginUrl, data);
  }
  register(data: any) {
    return this.post_request(this.registerUrl, data);
  }

  resendVerificationEmail(data: any) {
    return this.post_request(this.resendVerificationUrl, data);
  }

  forgotPasswordSendRequest(data: any) {
    return this.post_request(this.forgotPasswordUrl, data);
  }

  getUserAccountInfo() {
    return this.get_request(this.userInfoUrl);
  }

  logout(data: any) {
    return this.post_request(this.logoutUrl, data); 
  }
  refreshToken() {
    const data = {};
    return this.post_request(this.refreshTokenUrl, data);
  }
  resetPassword(data: any) {
    return this.post_request(this.resetPasswordUrl, data);
  }

  /**
   * Activate Account
   * @param data json object
   */
  activateAccount(data: any) {
    return this.post_request(this.activateAccountUrl, data);
  }

  changePassword(data: any) {
    return this.put_request(this.changePasswordUrl, data);
  }

  getgoogle2faStatus() {
    return this.get_request(this.google2faStatusUrl);
  }
}
