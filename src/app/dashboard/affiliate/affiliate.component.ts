import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css']
})
export class AffiliateComponent implements OnInit {
  affliliateLink: string;
  copiedMsg = false;
  constructor(
    private dataService: DataService,
    private restService: RestService) { }

  ngOnInit() {
    setTimeout(() => this.dataService.loader = true);
    this.restService.getReferralLink().subscribe( affiliateInfo => {
      this.dataService.loader = false;
      console.log("Affiliate info : ", affiliateInfo.data.affiliate_link);
      this.affliliateLink = affiliateInfo.data.affiliate_link;
    });
  }

  copyRefererLink(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copiedMsg = true;
    setTimeout(() => {
      this.copiedMsg = false;
    }, 5000);

  }

}
