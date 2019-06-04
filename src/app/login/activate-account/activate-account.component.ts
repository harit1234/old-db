import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  
  userId = '';
  hash = '';
  accountActivationStatus = 'Pending';
  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    public dataService: DataService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParams['id'];
    this.hash = this.route.snapshot.queryParams['hash'];
    const data = {
      'id': this.userId,
      'hash': this.hash
    };
    setTimeout(() => { this.dataService.loader = true; });
    this.restService.activateAccount(data).subscribe( (activeInfo: any) => {
      this.dataService.loader = false;
      this.accountActivationStatus = 'Success';
      console.log('Account activation Success!!!', activeInfo);
        
    }, error => {
      this.dataService.loader = false;
      this.accountActivationStatus = 'Fail';
      console.log('Account activation Failed!!!', error);
      
    });
  }

}
