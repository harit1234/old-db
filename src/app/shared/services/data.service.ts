import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TimerService } from './timer.service';
import { InstrumentModel } from '../models/instrument-model';
import { Dictionary } from '../models/dictionary';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  loader = false;
  registerError = '';
  countryList = '';
  tokenRefreshing = false;

  public instruments: Dictionary<InstrumentModel>;

  constructor(
    private restService: RestService, 
    private authService: AuthService,
    private router: Router,
    private timerService: TimerService
    ) { }


  register(data: any) {
      console.log('Register Data');
      console.log(data);
      this.loader = true;
      this.restService.register(data).subscribe(userInfo => {
        this.loader = false;
        localStorage.removeItem('refId');
        console.log('Request Data');
        console.log(data.email);
        localStorage.setItem('registerEmail',data.email);
        console.log('response');
        //this.authService.setCredentials(userInfo);
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
    this.restService.logout(data).subscribe ( val => {
        this.loader = false;
        console.log('Logout success');
        console.log(val);
        this.authService.clearSession();
        this.timerService.stopCheckApiStatusTimer();
        
    });
    
  }

  // getUserInfo() {
  //   this.restService.getUserAccountInfo().subscribe( val => {
  //     console.log("User info : ");
  //     console.log(val);
  //   }); 
  // }

  refreshToken() {
    this.restService.refreshToken().subscribe( (val: any) => {
      console.log("Redirect to page:");
      localStorage.setItem('token', val.access_token);
        //console.log(val.access_token, this.router.url);
        //this.router.navigate(['/dashboard/home']);
        
    }, error => {
      console.log('Refresh token failed!!!');
      //localStorage.removeItem('token');
      //this.router.navigate(['/dashboard/account']);
    });
  }

  getInstrument() {
    this.instruments = {};
    console.log('get Instrument function called');
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    //this.loader = true;
    this.restService.getInstruments(data).subscribe( (instrumentInfo: any) => {
      this.loader = false;
       console.log('Instruments : ', JSON.stringify(instrumentInfo));
       if(instrumentInfo) {
          instrumentInfo.instrument.forEach(instrument => {
            this.instruments[instrument.Symbol] = instrument;
          });
       } 
       
    });
  }

  /**
   * Fetching the country from API if not already fetched or return the old one
   */
  getCountryList() {

    if(this.countryList) return this.countryList;

    setTimeout(() => { this.loader = true; });
    this.restService.getCountryList({'lang': 'en'}).subscribe( (countryList: any) => {
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
    console.log('Check api status function called');
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getApiStatus(data).subscribe( apiStatus => {
       console.log('Api Status', JSON.stringify(apiStatus));
    });
  }
  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
}
