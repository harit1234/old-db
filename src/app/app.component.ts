import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AuthState } from './shared/enums/auth-state.enum';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './shared/services/data.service';
import { Meta } from '@angular/platform-browser';
import { VERSION } from '../environments/version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bitfex';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    public dataService: DataService,
    private meta: Meta) {

    console.log('AppComponent');
    console.log('Browser Lanugage' + navigator.language);


    this.authService.stateChanged.subscribe((state: AuthState) => {
      // translate.setDefaultLang('en');
      if (state === AuthState.LOGGED_IN) {
        this.dataService.startCheckingApiStatusTimer();
        console.log('Logged in');
        this.router.navigate(['dashboard']);
      } else if (state === AuthState.LOGGED_OUT) {
        console.log('Logout called: AppComponent');
        this.router.navigate(['login']);
      }
    });

    console.log(VERSION);
    /* tslint:disable */
    const versionValue = VERSION.version.toString() + (VERSION.hasOwnProperty('revision') ? ':' + VERSION['revision'].toString() : '');
    /* tslint:enable */

    this.meta.addTag({ name: 'version', content: versionValue });
  }

  ngOnInit() {
    
    //console.log("Language ddddd : ", document.documentElement.lang);
    // var browser_lang = window.navigator.language || window.navigator.userAgent; 
    // if (browser_lang === 'en-US') {
    //   console.log("language is english");
    // }

    const lang = localStorage.getItem('lang');
    if(lang) {

      this.dataService.selectedLanguage = lang;
    
    }else {
      
      this.dataService.selectedLanguage = 'en';
      localStorage.setItem('lang', this.dataService.selectedLanguage);
      
    }
    this.translate.use(this.dataService.selectedLanguage);

    if (this.authService.isAuthenticated()) {
      this.authService.setState(AuthState.LOGGED_IN);
      // this.dataService.startCheckingApiStatusTimer();
    }
  }

}
