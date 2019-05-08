import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  submitted = false;
  error = '';

  constructor(private loginFormBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginFormGroup = this.loginFormBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        factorCode: [''],
        recaptcha: ['', Validators.required]
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
    // stop here if form is invalid
    if (this.loginFormGroup.invalid) {
      // this.dataService.loader = false;
      console.log('Invalid');
      return;
    }
    console.log('Form Submitted!!');
    return false;
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
