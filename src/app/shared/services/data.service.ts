import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TimerService } from './timer.service';
import { InstrumentModel } from '../models/instrument-model';
import { Dictionary } from '../models/dictionary';
import { TranslateService } from '@ngx-translate/core';
import { WebSocketOmsService } from './web-socket-oms.service';
import { AccountModel } from '../../models/account-model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  loader = false;
  registerError = '';
  countryList = '';
  tokenRefreshing = false;
  hambergerMenuStatus = false;
  hamurgerLeftMenu = false;
  selectedLanguage: string;
  userCountryRestricted = false;

  tradingBalance:any;
  availableBalance:any;
  accountSubject = new Subject();

  public instruments: Dictionary<InstrumentModel>;

  constructor(
    private restService: RestService,
    private authService: AuthService,
    private router: Router,
    private timerService: TimerService,
    private translate: TranslateService,
    private wsOmsService: WebSocketOmsService
  ) {
    this.wsOmsService.onMessage.subscribe(message => this.onMessage(message));
   }

   onMessage(data): void {
     
      //console.log("On Message++++");
    if (data.data instanceof Blob) {
        const blobReader = new FileReader();
        blobReader.onload = () => {
            // console.log("On Load++++");
            // this.processWSMessage(<string>blobReader.result);
        };
        blobReader.readAsText(data.data);
    } else {
          //console.log("On Else++++",data);
        this.processWSMessage(data);
    }
  }

  processWSMessage(pack: {event: string, data: any}) {
    switch (pack.event) {
        
        case 'account': {
            this.setAccount(pack.data);
            break;
        }
        default: {
            break;
        }

    }
    return;
  }

  private _accountInfo: AccountModel;

  public get accountInfo(): AccountModel {
      return this._accountInfo;
  }

  public setAccount(account: AccountModel) {
    // console.log('Account Info:', account);
    this.tradingBalance = account.UnusedMargin;
    this.availableBalance = account.UsedMargin;
    this._accountInfo = account;
    this.accountSubject.next(account);
  }

  register(data: any) {
    this.loader = true;
    this.restService.register(data).subscribe(userInfo => {
      this.loader = false;
      localStorage.removeItem('refId');
      localStorage.setItem('registerEmail', data.email);
      this.router.navigate(['emailVerification']);
    }, error => {

      this.loader = false;
      this.registerError = error;
    });
  }

  /**
   * Logging out from the system
   */
  logout() {
    console.log('Logout Api should be called here!!');
    this.loader = true;
    const data = {};
    this.restService.logout(data).subscribe(val => {
      this.loader = false;
      console.log('Logout success');
      console.log(val);
      this.authService.clearSession();
      this.timerService.stopCheckApiStatusTimer();

    });

  }

  /**
   * This function gets the new token
   */
  refreshToken() {
    this.restService.refreshToken().subscribe((val: any) => {
      localStorage.setItem('token', val.access_token);
    }, error => {
      console.log('Refresh token failed!!!');
      // localStorage.removeItem('token');
      // this.router.navigate(['/dashboard/account']);
    });
  }

  /**
   * This function gets all the instruments available to calculate the amount, qty and price with denominators
   */
  getInstrument() {
    this.instruments = {};
    console.log('get Instrument function called');
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getInstruments(data).subscribe((instrumentInfo: any) => {
      this.loader = false;
      // console.log('Instruments : ', JSON.stringify(instrumentInfo.instrument));
      if (instrumentInfo.instrument) {

        if (instrumentInfo.instrument instanceof Array) {
          instrumentInfo.instrument.forEach(instrument => {
            this.instruments[instrument.Symbol] = instrument;
          });
        }else {
          this.instruments[instrumentInfo.instrument.Symbol] = instrumentInfo.instrument;
        }
      }

    });
  }

  /**
   * Fetching the country from API if not already fetched or return the old one
   */
  getCountryList() {

    if (this.countryList) {
      return this.countryList;
    }

    setTimeout(() => { this.loader = true; });
    this.restService.getCountryList({ 'lang': 'en' }).subscribe((countryList: any) => {
      this.loader = false;
      this.countryList = countryList.data.countries;
      console.log('Country List : ', this.countryList);
    });
    return this.countryList;

  }

  /**
   * Start checking API status
   */
  startCheckingApiStatusTimer() {
    this.timerService.startCheckApiStatusTimer(this.checkApiStatus.bind(this));
  }

  checkApiStatus() {
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    if(!localStorage.getItem('sessionIdStorage')) {
      this.logout();
    }else {
      this.restService.getApiStatus(data).subscribe( (apiStatus:any) => {
        console.log('Api Status: ', apiStatus.status);
        if(apiStatus.status === false) {
          this.logout();
        }
        
      });
    }
    
  }
  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
  hideHambergurMenu() {
    this.hambergerMenuStatus = false;
    this.hamurgerLeftMenu = false;
  }
  changeLanguage(lang: string) {
    console.log(lang);
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.selectedLanguage = lang;

  }
}
