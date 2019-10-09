import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { constants } from '../../../constants';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { WebSocketOmsService } from '../../shared/services/web-socket-oms.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  coinsArray = [];
  withdrawFormGroup: FormGroup;
  submitted = false;
  error = '';
  googleFaStatus = false;
  defaultCurrency:string;
  minWithdrawalAmount: any;
  defaultWithdrawalFee:any;
  constructor(
    private withdrawFormBuilder: FormBuilder,
    public dataService: DataService,
    private restService: RestService,
    public pricePipe:PricePipe,
    private wsOmsService: WebSocketOmsService
  ) { }

  ngOnInit() {

    //this.wsOmsService.subscribeAllOms(localStorage.getItem('userIdStorage'), localStorage.getItem('sessionIdStorage'), '1568285187_ANIL_KUMAR_STIGASOFT_COM');
    this.wsOmsService.subscribeAllOms('AWANISH_IDAP_IO', 'e0efc558-1002-4d97-90dd-3343772b2016', '1563979134_AWANISH_IDAP_IO');
    setTimeout(() => this.dataService.loader = true);
    this.restService.getgoogle2faStatus().subscribe((statusInfo: any) => {
      console.log('Google 2fa status success', statusInfo);

      if(statusInfo.data.g2fa_status !== 'disabled') {
          this.googleFaStatus = true;
          this.getCurrencies();
      }

      console.log('Google fa satus', this.googleFaStatus);
      this.dataService.loader = false;

    }, error => {
      console.log('Google 2fa status failed');
      console.log(error);
    });
  
    this.withdrawFormGroup = this.withdrawFormBuilder.group({
      'address': ['', Validators.required],
      'tradingBalance': [''],
      'available': [''],
      'amount': ['', Validators.required],
      'comment': ['', Validators.required]
    });
    this.defaultCurrency = constants.DEFAULT_CURRENCY;
  }

  getCurrencies() {
    
    setTimeout(() => { this.dataService.loader = true;});
    
    this.restService.getCurrencies().subscribe((currenciesInfo: any) => {
      console.log('Returned Data: ', currenciesInfo);

      this.dataService.loader = false;
      if (currenciesInfo.data instanceof Array) {
         console.log('array : ', currenciesInfo);
         
         currenciesInfo.data.forEach(element => {
          const keys = Object.keys(element);
          keys.forEach( key => {
            this.coinsArray.push({key: key, value: element[key].name});           
          });
         });
      } else {
        const keys = Object.keys(currenciesInfo.data);
        console.log(keys);
        keys.forEach(key => {
          this.coinsArray.push({key: key, value: currenciesInfo.data[key].name});
          
          let minWithAmount = currenciesInfo.data[key].minwithdraw;
          let defaultWithFee = currenciesInfo.data[key].withdraw_fee;

          this.minWithdrawalAmount = minWithAmount.toFixed(8);
          this.defaultWithdrawalFee = defaultWithFee.toFixed(8);
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.withdrawFormGroup.invalid) {
      console.log('Invalid');
      return;
    }

    const data = {'coin': this.formFields.coin.value};

    console.log('Data to send ', data);
    //return;
    this.dataService.loader = true;
    this.restService.getAddress(data).subscribe(addressInfo => {
      this.dataService.loader = false;
      
      console.log('Address Result:', addressInfo);
      
      
    }, error => {
      this.withdrawFormGroup.reset();
      this.submitted = false;
      this.error = error;
    });
  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.withdrawFormGroup.controls;
  }

}
