import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  registerFormGroup: FormGroup;
  submitted = false;
  error = '';
  constructor(
    private registerFormBuilder: FormBuilder,
    private dataService: DataService) { 

  }

  ngOnInit() {
    this.registerFormGroup = this.registerFormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      terms: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }
  get siteKey() {
    return AppConfig.settings.recaptchaKey;
  }
  // convenience getter for easy access to form fields
  get formFields() {
    return this.registerFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.formFields);
    const data = {
      'email': this.formFields.email.value,
      'password': this.formFields.password.value,
      'country': this.formFields.country.value,
      'firstName': this.formFields.firstName.value,
      'lastName': this.formFields.lastName.value,
      'terms': this.formFields.terms.value
    };

    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      // this.dataService.loader = false;
      console.log('Invalid');
      return;
    }
    console.log('Form Submitted!!');
    this.dataService.register(data)

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
