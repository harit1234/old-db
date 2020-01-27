import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { RestService } from '../shared/services/rest.service';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  submitted = false;
  error = '';
  errorCode = '';
  returnUrl: string;
  constructor(
    private loginFormBuilder: FormBuilder,
    private dataService: DataService,
    private restService: RestService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loginFormGroup = this.loginFormBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        factorCode: [''],
        recaptcha: ['', Validators.required]
      }
    );
    this.authService.clearSession();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Get the recaptcha key
   */
  get siteKey() {
    return environment.recaptchaKey;
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

  /**
   * Login function sets all the variables after successful login
   * @param data 
   */
  login(data: any) {
    this.dataService.loader = true;
    this.restService.login(data).subscribe(userInfo => {
      console.log('response');
      this.authService.setCredentials(userInfo);
      this.router.navigate(['dashboard']);
      // this.router.navigate([this.returnUrl]);
    }, error => {
      this.loginFormGroup.controls.password.reset();
      this.submitted = false;
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
