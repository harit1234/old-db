import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  loader = false;
  constructor(private restService: RestService, private authService: AuthService) { }


  register(data: any) {
      console.log('Register Data');
      console.log(data);
      this.restService.register(data).subscribe(userInfo => {
        console.log('response');
        //this.authService.setCredentials(userInfo);
        //this.router.navigate([this.returnUrl]);
      }, error => {
        
        this.loader = false;
        //this.error = error;
      });
  }

  /**
   * Logging out from the system
   */
  logout() {
    console.log('Logout Api should be called here!!');
    this.authService.clearSession();
  }
  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
}
