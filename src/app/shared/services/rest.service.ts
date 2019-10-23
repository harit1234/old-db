import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  // jwtHelper = new JwtHelperService();
  private EQUAL = '=';
  private AMP = '&';
  private loginUrl = 'login';
  private registerUrl = 'register';
  private resendVerificationUrl = 'resend_verification_email';
  private forgotPasswordUrl = 'forgot_password';
  private logoutUrl = 'logout';
  private userInfoUrl = 'userinfo';
  private getCountryUrl = 'get_countries';
  private refreshTokenUrl = 'refresh_token';
  private resetPasswordUrl = 'reset_password';
  private activateAccountUrl = 'activate_account';
  private changePasswordUrl = 'change_password';
  private google2faStatusUrl = 'google_2fa_status';
  private google2faPostUrl = 'google_2fa';
  private accountBalanceUrl = 'account_balance';
  private tradeHistoryUrl = 'trade_history';
  private orderHistoryUrl = 'order_history';
  private apiStatusUrl = 'get_api_status';
  private getInstrumentUrl = 'get_instrument';
  private getActivityLogUrl = 'activity_log';
  private getAffiliateLinkUrl = 'affiliate';
  private getLeaderboardUrl = 'leaderboard';
  private getPageContentUrl = 'get_page';
  private getApiCredentialsUrl = 'generate_api_secret_key';
  private getAddressUrl = 'wallets/address';
  private getCurrencyUrl = 'wallets/currencies';
  private sendWithdrawalUrl = 'wallets/withdrawal';
  private verify2faUrl = 'verify_2fa';
  private getWallentHistoryUrl = 'wallets/history';
  private cancelWithdrawalUrl = 'wallets/withdrawal';
  private withdrawalConfirmUrl = 'wallets/withdrawal/confirm';
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
            `${err}`);
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
  private del_request(url: string): Observable<any> {

    return this.http.delete(environment.restUrl + url,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }).pipe(map(d => {
        return d;
      }),
        catchError((err, caught) => {
          console.log(err);
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

  getCountryList(data: any) {
    return this.post_request(this.getCountryUrl, data);
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

  setGoogle2fa(data: any) {
    return this.put_request(this.google2faPostUrl, data);
  }

  getAccountBalance(data: any) {
    return this.post_request(this.accountBalanceUrl, data);
  }

  getTradeHistory(data: any) {
    return this.post_request(this.tradeHistoryUrl, data);
  }
  getOrderHistory(data: any) {
    return this.post_request(this.orderHistoryUrl, data);
  }

  getApiStatus(data: any) {
    return this.post_request(this.apiStatusUrl, data);
  }
  getInstruments(data: any) {
    return this.post_request(this.getInstrumentUrl, data);
  }
  getActivityLog() {
    return this.get_request(this.getActivityLogUrl);
  }
  getReferralLink() {
    return this.get_request(this.getAffiliateLinkUrl);
  }
  getLeaderBoard() {
    return this.get_request(this.getLeaderboardUrl);
  }
  getAddress(data: any) {
    const url = this.getAddressUrl+'/'+data.coin;
    return this.get_request(url);
  }
  getPageContent(data: any) {
    return this.post_request(this.getPageContentUrl, data);
  }

  getApiCredentials(data: any) {
    return this.post_request(this.getApiCredentialsUrl, data);
  }
  getCurrencies() {
    return this.get_request(this.getCurrencyUrl);
  }

  sendWithdrawalRequest(data:any) {
    return this.post_request(this.sendWithdrawalUrl, data);
  }

  verifyTwoFaCode(data:any) {
    return this.post_request(this.verify2faUrl, data);
  }
  
  getWalletHistory(data:any) {
    const url = this.getWallentHistoryUrl+'/'+data.symbol+'/'+data.history_type;
    return this.get_request(url);
  }
  
  cancelWithdrawal(data:any) {
    const url = this.cancelWithdrawalUrl+'/'+data.withdrawalId;
    return this.del_request(url);
  }
  confirmWithdrawal(data:any) {
    return this.post_request(this.withdrawalConfirmUrl, data);
  }
  // getTokenStaus() {
  //   var token = localStorage.getItem('token');
  //   if(token !== null) {
  //       return this.jwtHelper.isTokenExpired(token)
  //   } else {
  //     // Token is not there then logout from the
  //   }
  // }

}
