import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AuthState } from './shared/enums/auth-state.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'idap-web';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.stateChanged.subscribe((state: AuthState) => {
      if (state === AuthState.LOGGED_IN) {
        console.log('Logged in');
        this.router.navigate(['dashboard']);
      } else if (state === AuthState.LOGGED_OUT) {
        console.log('Logout called: AppComponent');
        this.router.navigate(['login']);
      }
    });
  }
}
