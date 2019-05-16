import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  submitted = false;
  error = '';
  forgotFormGroup: FormGroup;
  serverError = '';
  forgotRequestSuccessMsg = '';

  constructor(
    private forgotFormBuilder: FormBuilder,
    private restService: RestService,
    public dataService: DataService) { }

  ngOnInit() {
    this.forgotFormGroup = this.forgotFormBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.formFields.email.valueChanges.subscribe( val => {
        this.serverError = '';
    });
  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.forgotFormGroup.controls;
  }

  sendRequest() {
    this.serverError = '';
    this.submitted = true;
    if (this.forgotFormGroup.invalid) {
      console.log('Invalid');
      return;
    }
    
    const data = { 'email': this.formFields.email.value };
    console.log(data);
    this.dataService.loader = true;
    this.restService.forgotPasswordSendRequest(data).subscribe( (val: any) => {
      this.dataService.loader = false;
      this.forgotRequestSuccessMsg = val.data.message;
      console.log('Forgot password success', val.data.message);
    }, error => {
      this.serverError = error;
      console.log(error);
    });
  }


}
