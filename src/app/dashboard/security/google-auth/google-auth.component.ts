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
  faCodeStatus:string;
  secret:string;
  gQrCode:string;
  formActive = false;
  btnLblText: string;
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
    this.restService.getgoogle2faStatus().subscribe( (statusInfo: any) => {
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
    let btnText = '';
    if(faCodeStatus == 'enabled') {
      btnText = 'lblDisable';
    }else {
      btnText = 'lblEnable';
    }
    this.translateService.get('googleAuth.'+btnText).subscribe( text => {
      this.btnLblText = text;
    });
  }

  get formFields() {
    return this.googleAuthFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if(this.googleAuthFormGroup.invalid) {
      console.log('Invalid');
    }
    const data = {
      '2fa_secret': this.formFields.secret.value,
      '2fa_status': 'enabled',
      'googleotp': this.formFields.twoFactorCode.value
    };

    console.log("Submitted Data : " ,data);
  }

}
