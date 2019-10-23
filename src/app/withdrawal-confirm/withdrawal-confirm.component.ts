import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../shared/services/rest.service';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-withdrawal-confirm',
  templateUrl: './withdrawal-confirm.component.html',
  styleUrls: ['./withdrawal-confirm.component.css']
})
export class WithdrawalConfirmComponent implements OnInit {
  error = '';
  msgSuccess = '';
  userId = '';
  hash = '';
  withdrawalConfirmStatus:any;
  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    public dataService: DataService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParams['id'];
    this.hash = this.route.snapshot.queryParams['hash'];
    const data = {
      'id': this.userId,
      'hash': this.hash
    };
    setTimeout(() => { this.dataService.loader = true; });
    this.restService.confirmWithdrawal(data).subscribe((withdrawalConfirmationInfo: any) => {
      this.dataService.loader = false;
      this.withdrawalConfirmStatus = true;
      console.log('Withdrawal confirmation status!!!', withdrawalConfirmationInfo);
      this.translateService.get('langServerSuccess.' + withdrawalConfirmationInfo.data.code).subscribe(text => {
        console.log('Success message : ', text);
        this.msgSuccess = text;
      });


    }, error => {
      this.error = error;
      this.dataService.loader = false;
      this.withdrawalConfirmStatus = false;
      console.log('Withdrawal confirmation Failed!!!', error);

    });
  }

}
