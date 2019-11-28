import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-api-secret',
  templateUrl: './api-secret.component.html',
  styleUrls: ['./api-secret.component.css']
})
export class ApiSecretComponent implements OnInit {

  secretGeneratedStatus:any;
  serverError:any;
  credentialApiKey:string;
  credentialSecretKey:string;
  successStatus = false;
  twoFactorFormGroup: FormGroup;
  twoFASubmitted = false;
  twoFAError = '';
  error = '';
  googleFaStatus = false;
  showTwoFactorForm = false;
  showButtons = true;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.showTwoFactorForm = false;
  }

  constructor(
    private translateService: TranslateService, 
    private dataService: DataService,
    private restService: RestService,
    private twoFactorFormBuilder:FormBuilder) { }

  ngOnInit() {
    setTimeout(() => this.dataService.loader = true);
    this.restService.getgoogle2faStatus().subscribe((statusInfo: any) => {
      console.log('Google 2fa status success', statusInfo);

      if(statusInfo.data.g2fa_status !== 'disabled') {
          this.googleFaStatus = true;
      }

      console.log('Google fa satus', this.googleFaStatus);
      this.dataService.loader = false;

    }, error => {
      console.log('Google 2fa status failed');
      console.log(error);
    });

    this.secretGeneratedStatus = localStorage.getItem('apiSecretGenerated'); 
    if(this.secretGeneratedStatus != 'true') {
      this.secretGeneratedStatus = 'false';
    }
    console.log('secretGeneratedStatus=', this.secretGeneratedStatus);
    // if(this.secretGeneratedStatus == 'true') {
    //   this.generateCredentials();
    // }

    this.twoFactorFormGroup = this.twoFactorFormBuilder.group({'otp': ['', Validators.required]});
  }

  generateCredentials() {
    this.error = '';
    this.showTwoFactorForm = true;
    return;
  }

  viewCredentials() {
    this.error = '';
    this.showTwoFactorForm = true;
    return;
  }

  getApiCredentials(){
    this.successStatus = false;
    this.serverError = '';
    setTimeout(() => { this.dataService.loader = true;});
    
    const data = {};
    this.restService.getApiCredentials(data).subscribe((credentialInfo: any) => {
      this.dataService.loader = false;
     
      this.credentialApiKey = credentialInfo.data.api_key;
      this.credentialSecretKey = credentialInfo.data.api_secret;

      if(this.secretGeneratedStatus == 'false' && this.credentialSecretKey != ''){
        localStorage.setItem('apiSecretGenerated', 'true');
        this.secretGeneratedStatus = 'true';
      }

      if(this.credentialSecretKey != ''){
        this.showButtons = false;
      }

      if(credentialInfo.success === true) {
        this.successStatus = true;
        //this.credentialSecretKey = credentialInfo.data.api_secret;
      }
      // console.log('Credential Info: ', credentialInfo.data.api_key, credentialInfo.data.api_secret, credentialInfo.success);
    }, error => {
      this.serverError = error;
      console.log(error);
    });

  }

  onTwoFaSubmit() {

    this.twoFASubmitted = true;

    if (this.twoFactorFormGroup.invalid) {
      console.log('Invalid');
      return;
    }
    //this.showTwoFactorForm = false;
    const data = {'googleotp': this.twoFactorformFields.otp.value};
    this.dataService.loader = true;
    this.restService.verifyTwoFaCode(data).subscribe( (twoFactorStatus:any) => {
      this.dataService.loader = false;
      this.showTwoFactorForm = false;
      this.twoFASubmitted = false;
      this.twoFactorFormGroup.reset();
      if(twoFactorStatus.success === true) {
        this.getApiCredentials();
      }
    }, error => {
      this.error = error;
      this.twoFactorFormGroup.reset();
      this.twoFASubmitted = false;
      this.showTwoFactorForm = false;
    });

    return;
  }
  get twoFactorformFields() {
    return this.twoFactorFormGroup.controls;
  }

  hidePopup() {
    this.twoFactorFormGroup.reset();
    this.twoFASubmitted = false;
    this.showTwoFactorForm = false;
  }
  
}
