import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { RestService } from '../../../shared/services/rest.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit {

  googleAuthFormGroup: FormGroup;
  submitted = false;
  error = '';
  faCodeStatus: string;
  secret: string;
  gQrCode: string;
  formActive = false;
  btnText = '';
  btnLblText: string;
  successMsg = '';
  constructor(
    private googleAuthFormBuilder: FormBuilder,
    public dataService: DataService,
    private restService: RestService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.googleAuthFormGroup = this.googleAuthFormBuilder.group({
      twoFactorCode: ['', Validators.required]
    });
    setTimeout(() => this.dataService.loader = true);
    this.restService.getgoogle2faStatus().subscribe((statusInfo: any) => {
      console.log('Google 2fa status success', statusInfo);

      this.faCodeStatus = statusInfo.data.g2fa_status;
      this.gQrCode = statusInfo.data.g2fa_qrcode;
      this.secret = statusInfo.data.g2fa_secret;
      this.getBtnLbl(this.faCodeStatus);

      this.dataService.loader = false;
    }, error => {
      console.log('Google 2fa status failed');
      console.log(error);
    });

  }

  getBtnLbl(faCodeStatus: string) {

    if (faCodeStatus === 'enabled') {
      this.btnText = 'lblDisable';
    } else {
      this.btnText = 'lblEnable';
    }
    this.translateService.get('langGoogleAuth.' + this.btnText).subscribe(text => {
      this.btnLblText = text;
    });
  }

  get formFields() {
    return this.googleAuthFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.successMsg = '';
    console.log(this.googleAuthFormGroup);
    if (this.googleAuthFormGroup.invalid) {

      console.log('Invalid');
      return;
    }
    let action = 'disabled';
    if (this.btnText === 'lblEnable') {
      action = 'enabled';
    }

    const data = {
      'g2fa_secret': this.secret,
      'g2fa_status': action,
      'googleotp': this.formFields.twoFactorCode.value
    };
    console.log('Submitted Data : ', data);
    this.dataService.loader = true;
    this.restService.setGoogle2fa(data).subscribe((gAuthInfo: any) => {

      console.log(gAuthInfo);
      this.translateService.get('langServerSuccess.' + gAuthInfo.data.code).subscribe(text => {
        this.successMsg = text;
      });
      this.resetGoogleAuthForm();

    }, error => {
      this.googleAuthFormGroup.reset();
      this.submitted = false;
      this.error = error;
      console.log(error);


    });

  }

  /**
   * Reseting the google auth form
   */
  resetGoogleAuthForm() {

    this.restService.getgoogle2faStatus().subscribe((statusInfo: any) => {
      this.faCodeStatus = statusInfo.data.g2fa_status;
      this.gQrCode = statusInfo.data.g2fa_qrcode;
      this.secret = statusInfo.data.g2fa_secret;
      this.getBtnLbl(this.faCodeStatus);
      this.googleAuthFormGroup.reset();
      this.submitted = false;
      this.dataService.loader = false;
    }, error => {
      console.log('Google 2fa status failed');
      console.log(error);
    });
  }

}
