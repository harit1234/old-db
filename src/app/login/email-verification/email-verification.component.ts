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
  processing = false;
  emailSendError = false;
  constructor(
    private authService: AuthService,
    private restService: RestService,
    public dataService: DataService) {
    this.registerEmail = localStorage.getItem('registerEmail');
  }

  ngOnInit() {
    if (!this.registerEmail) {
      this.authService.clearSession();
    }
  }
  resendEmail() {

    this.processing = true;
    const emailToSend = localStorage.getItem('registerEmail');
    if (emailToSend) {
      this.dataService.loader = true;
      const data = { 'email': emailToSend };
      this.restService.resendVerificationEmail(data).subscribe(resetMailInfo => {
        this.processing = false;
        this.dataService.loader = false;
        this.emailSentStatus = true;

      }, error => {
        this.emailSendError = true;
      });
    } else {
      this.authService.clearSession();
    }

  }
}
