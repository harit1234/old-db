import { Component, OnInit } from '@angular/core';
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

  constructor(
    private translateService: TranslateService, 
    private dataService: DataService,
    private restService: RestService) { }

  ngOnInit() {
    this.secretGeneratedStatus = localStorage.getItem('apiSecretGenerated'); 
    if(this.secretGeneratedStatus == 'true') {
      this.generateCredentials();
    }
  }

  generateCredentials() {
    this.successStatus = false;
    this.serverError = '';
    setTimeout(() => { this.dataService.loader = true;});
    
    const data = {};
    this.restService.getApiCredentials(data).subscribe((credentialInfo: any) => {
      this.dataService.loader = false;
      localStorage.setItem('apiSecretGenerated', 'true');
      this.secretGeneratedStatus = 'true';
      this.credentialApiKey = credentialInfo.data.api_key;
      if(credentialInfo.success === true) {
        this.successStatus = true;
        this.credentialSecretKey = credentialInfo.data.api_secret;
      }
      // console.log('Credential Info: ', credentialInfo.data.api_key, credentialInfo.data.api_secret, credentialInfo.success);
    }, error => {
      this.serverError = error;
      console.log(error);
    });
  }
  
}
