import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AuthState } from './shared/enums/auth-state.enum';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'idap-web';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private translate: TranslateService,
    public dataService: DataService) {

      console.log('AppComponent');
      
      this.authService.stateChanged.subscribe((state: AuthState) => {
      //translate.setDefaultLang('en');
      if (state === AuthState.LOGGED_IN) {
        this.dataService.startCheckingApiStatusTimer();
        console.log('Logged in');
        this.router.navigate(['dashboard']);
      } else if (state === AuthState.LOGGED_OUT) {
        console.log('Logout called: AppComponent');
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit() {
    this.translate.use('en');
  }

}
