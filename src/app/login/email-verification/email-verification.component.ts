import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  registerEmail: string;
  emailSentStatus = false;
  constructor(
    private authService: AuthService,
    private restService: RestService,
    public dataService: DataService) { 
    this.registerEmail = localStorage.getItem('registerEmail');
  }

  ngOnInit() {
    console.log("Registered Email" + this.registerEmail);
    if(!this.registerEmail) {
        this.authService.clearSession();
    }
  }
  resendEmail() {
    const emailToSend = localStorage.getItem('registerEmail');
    console.log('Email has been sent to ', emailToSend);
    if(emailToSend) {
      this.dataService.loader = true;
      const data = {'email': emailToSend};
      this.restService.resendVerificationEmail(data).subscribe( data => {
        this.dataService.loader = false;
        this.emailSentStatus = true;
      });
    }else {
      this.authService.clearSession();
    }
    
  }
}
