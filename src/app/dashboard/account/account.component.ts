import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userInfo: any = '';
  activityLog: any = '';
  constructor(
    public dataService: DataService,
    private restService: RestService) { }

  ngOnInit() {
    console.log("AccountComponent: ngInit");

    setTimeout(() => this.dataService.loader = true);
    this.restService.getUserAccountInfo().subscribe( userInfo => {
      this.dataService.loader = false;
      console.log("User info : ");
      this.userInfo = userInfo.data;
      console.log(this.userInfo);
    });
  }
}
