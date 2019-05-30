import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TimerService } from './timer.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  loader = false;
  registerError = '';
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
    });
    
  }

  // getUserInfo() {
  //   this.restService.getUserAccountInfo().subscribe( val => {
  //     console.log("User info : ");
  //     console.log(val);
  //   }); 
  // }

  refreshToken() {
    console.log("Redirect to page:");
    this.router.navigate(['/dashboard/account']);
    return;
    this.restService.refreshToken().subscribe( val => {
        console.log(val, this.router.url);
        this.router.navigate(['/dashboard/home']);
        
    });
  }

  /**
   * Start checking API status
   */
  startCheckingApiStatusTimer() {
    this.timerService.startCheckCardTimer(this.checkApiStatus.bind(this));
  }

  checkApiStatus() {
    console.log('Check api status function called');
    const data = {
      'token_id': localStorage.getItem('token'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getApiStatus(data).subscribe( apiStatus => {
       console.log('Api Status', apiStatus);
    });
  }
  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
}
