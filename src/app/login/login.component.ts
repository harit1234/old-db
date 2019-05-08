import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { DataService } from '../shared/services/data.service';
import { RestService } from '../shared/services/rest.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private loginFormBuilder: FormBuilder, 
    private dataService: DataService, 
    private restService: RestService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loginFormGroup = this.loginFormBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        factorCode: [''],
        recaptcha: ['']
        // recaptcha: ['', Validators.required]
      }
    );
  }

  get siteKey() {
    return AppConfig.settings.recaptchaKey;
  }
  // convenience getter for easy access to form fields
  get formFields() {
    return this.loginFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.formFields);
    const data = {
        'username': this.formFields.email.value,
        'password': this.formFields.password.value,
        'googleotp': this.formFields.factorCode.value
    };

    // stop here if form is invalid
    if (this.loginFormGroup.invalid) {
      // this.dataService.loader = false;
      console.log('Invalid');
      return;
    }
    console.log('Form Submitted!!');
    this.login(data);
    
  }

  login(data: any) {
    this.dataService.loader = true;
    this.restService.login(data).subscribe( userInfo => {
          console.log('response');
          this.authService.setCredentials(userInfo);
      }, error => {
        console.log('Error ssssss');
        console.log(error.error);
        this.dataService.loader = false;
        this.error = error;
      });
  }

  /**
   * Recaptcha is loading
   */
  handleLoad() {
    console.log('Captcha loading');
  }

  /**
   * After recapcha sucess function
   * @param event returns the key
   */
  handleSuccess(event: any) {
    console.log(event);
  }

}
