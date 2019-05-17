import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../../../shared/helpers/must-match.validator';
import { DataService } from '../../../shared/services/data.service';
import { RestService } from '../../../shared/services/rest.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordGroup: FormGroup;
  submitted = false;
  error = '';
  changePasswordStatus = false;
  constructor(
    private changePasswordFormBuilder: FormBuilder,
    public dataService: DataService,
    public resetService: RestService) { }

  ngOnInit() {

    this.changePasswordGroup = this.changePasswordFormBuilder.group({
      'currentPassword': ['', Validators.required],
      'password': ['', [Validators.required, Validators.minLength(8)]],
      'confirmPassword': ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.error = '';
    this.changePasswordStatus = false;
    this.submitted = true;

    if(this.changePasswordGroup.invalid) {
      console.log('Invalid');
      return;
    }

    const data = {
      'current_password': this.formFields.currentPassword.value,
      'password': this.formFields.password.value,
    };
    
    console.log('Data to send ', data);
    this.dataService.loader = true;
    this.resetService.changePassword(data).subscribe( changePassInfo => {
      this.dataService.loader = false;
      this.changePasswordStatus = true;
      console.log('Change password success');
      console.log(changePassInfo);
    }, error => {
      console.log('Change password failed!');
      this.error = error;
    });
  }
  
  // convenience getter for easy access to form fields
  get formFields() {
    return this.changePasswordGroup.controls;
  }

}
