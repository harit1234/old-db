import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../shared/helpers/must-match.validator';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  submitted = false;
  error = '';
  resetPasswordGroup: FormGroup;
  userId = '';
  hash = '';
  resetPasswordSuccessMsg = '';

  constructor(
    private resetPasswordFormBuilder: FormBuilder,
    private route: ActivatedRoute,
    private restService: RestService,
    public dataService: DataService) { }

  ngOnInit() {
    this.resetPasswordGroup = this.resetPasswordFormBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
    this.userId = this.route.snapshot.queryParams['id'];
    this.hash = this.route.snapshot.queryParams['hash'];
  }

  get formFields() {
    return this.resetPasswordGroup.controls;
  }
  resetPassword() {
    
    this.error = '';
    this.resetPasswordSuccessMsg ='';
    this.submitted = true;
    if(this.resetPasswordGroup.invalid) {
      console.log('Invalid');
      return;
    }

    this.dataService.loader = true;
    const data = {
      'id': this.userId,
      'hash': this.hash,
      'password': this.formFields.newPassword.value
    };
    this.restService.resetPassword(data).subscribe ( (resetInfo: any) => {
      this.dataService.loader = false;
      console.log('Reset Password success');
      this.resetPasswordSuccessMsg = resetInfo.data.message;
    }, error => {
      this.dataService.loader = false;
      console.log('Reset Password Fail!!');
      console.log(error);
      this.error = error;
    });
    console.log('Password reset form submit success');

  }

}
