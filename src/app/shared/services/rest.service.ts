import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  private EQUAL = '=';
  private AMP = '&';
  private loginUrl = 'login';
  private registerUrl = '/resiter';
  private getCommonSettingsUrl = 'api/customer/Getkiosk';
  private getCardInfoUrl = 'api/card/GetCardInformation';
  private getCustomerSettignsUrl = 'api/customer/GetCustomerSettings';
  private getTokenUrl = 'api/payment/gettoken';
  private makePaymentUrl = 'api/payment/postpayment';
  private loadMoneyUrl = 'api/card/AddMoney/';
  private sendReceiptUrl = 'api/customer/SendEmail';
  constructor(private http: HttpClient) {

  }
  private post_request(url: string, data): Observable<string> {
    // const formData = Object.keys(data)
    //   .map(key => Array.isArray(data[key])
    //     ? data[key].map(value => key + this.EQUAL + encodeURIComponent(ng g s guards/authGuard --spec falsevalue)).join(this.AMP)
    //     : key + this.EQUAL + encodeURIComponent(data[key])
    //   ).join(this.AMP);
    //  console.log('post_request: ', url, ', ', data);
    return this.http.post<any>(AppConfig.settings.restUrl + url, data,
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

  // private post_request_query(url: string, data): Observable<string> {
  //   const formData = Object.keys(data)
  //     .map(key => Array.isArray(data[key])
  //       ? data[key].map(value => key + this.EQUAL + encodeURIComponent(value)).join(this.AMP)
  //       : key + this.EQUAL + encodeURIComponent(data[key])
  //     ).join(this.AMP);
  //   console.log('post_request: ', url, ', ', formData);
  //   return this.http.post<any>(AppConfig.settings.restUrl + url + '?' + formData, '',
  //     {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     }).pipe(map(d => {
  //       return d;
  //     }),
  //       catchError((err, caught) => {
  //         console.log(err);
  //         return throwError(
  //           `Error: ${err}`);
  //       })
  //     );
  // }

  // private get_request(url: string): Observable<any> {

  //   return this.http.get(AppConfig.settings.restUrl + url,
  //     {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
  //     }).pipe(map(d => {
  //       return d;
  //     }),
  //       catchError((err, caught) => {
  //         console.log(err);
  //         return throwError(
  //           `Error: ${err}`);
  //       })
  //     );
  // }


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
}
