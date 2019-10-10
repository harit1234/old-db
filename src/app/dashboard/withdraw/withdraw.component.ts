import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { constants } from '../../../constants';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { WebSocketOmsService } from '../../shared/services/web-socket-oms.service';
import { AccountModel } from '../../models/account-model';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit, OnDestroy {

  coinsArray = [];
  withdrawFormGroup: FormGroup;
  twoFactorFormGroup: FormGroup;
  submitted = false;
  twoFASubmitted = false;
  twoFAError = '';
  error = '';
  googleFaStatus = false;
  showTwoFactorForm = false;
  defaultCurrency:string;
  minWithdrawalAmount: any;
  defaultWithdrawalFee:any;
  tradingBalance:any;
  availableBalance:any;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.showTwoFactorForm = false;
  }

  constructor(
    private withdrawFormBuilder: FormBuilder,
    private twoFactorFormBuilder:FormBuilder,
    public dataService: DataService,
    private restService: RestService,
    public pricePipe:PricePipe,
    private wsOmsService: WebSocketOmsService
  ) { }

  ngOnInit() {


    this.dataService.accountSubject.subscribe( (accountInfo: AccountModel) => {

      this.tradingBalance = parseFloat(accountInfo.UnusedMargin.toString()).toFixed(8);
      this.availableBalance = parseFloat(accountInfo.UsedMargin.toString()).toFixed(8);

      this.formFields.tradingBalance.setValue(this.tradingBalance);
      this.formFields.available.setValue(this.availableBalance);

    });

    setTimeout(() => this.dataService.loader = true);
    this.restService.getgoogle2faStatus().subscribe((statusInfo: any) => {
      console.log('Google 2fa status success', statusInfo);

      if(statusInfo.data.g2fa_status !== 'disabled') {
          this.googleFaStatus = true;
          this.getCurrencies();
          this.initiateWebSocketConnection();
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
    this.twoFactorFormGroup = this.twoFactorFormBuilder.group({'otp': ['', Validators.required]});
    this.defaultCurrency = constants.DEFAULT_CURRENCY;
  }

  initiateWebSocketConnection() {
    console.log('Getting Account Info....');
    this.dataService.loader = true;
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getAccountBalance(data).subscribe((balanceInfo :any) => {

      console.log('Initiating web socket connection....');

      console.log(balanceInfo.account.ExchangeAccountId);
      const exchangeAccId = balanceInfo.account.ExchangeAccountId;
      localStorage.setItem('exchangeAccountId', exchangeAccId);
      this.wsOmsService.subscribeAllOms(localStorage.getItem('userIdStorage'), localStorage.getItem('sessionIdStorage'), exchangeAccId);

      this.dataService.loader = false;
    }, error => {
      console.log('Error gettting balance info');
    });
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
    this.showTwoFactorForm = true;
    return;
  }

  sendWithdrawData() {
    const data = {
      'address': this.formFields.address.value,
      'symbol': constants.DEFAULT_CURRENCY,
      'amount': this.formFields.amount.value,
      'comment': this.formFields.comment.value
    };
    this.dataService.loader = true;
    this.restService.sendWithdrawalRequest(data).subscribe( withdrawSatus => {
      this.dataService.loader = false;
        console.log('Withdraw Data staus :: ', withdrawSatus);
    }, error => {
      this.error = error;
    }); 
  }
  // convenience getter for easy access to form fields
  get formFields() {
    return this.withdrawFormGroup.controls;
  }

  onTwoFaSubmit() {
   
    this.twoFASubmitted = true;

    if (this.twoFactorFormGroup.invalid) {
      console.log('Invalid');
      return;
    }
    //this.showTwoFactorForm = false;
    const data = {'googleotp': this.twoFactorformFields.otp.value};
    this.dataService.loader = true;
    this.restService.verifyTwoFaCode(data).subscribe( (twoFactorStatus:any) => {
      this.dataService.loader = false;
      this.showTwoFactorForm = false;
      console.log('Address Result:', twoFactorStatus.success);

      if(twoFactorStatus.success === true) {
        this.sendWithdrawData();
      }
    }, error => {
      this.error = error;
      this.twoFactorFormGroup.reset();
      this.twoFASubmitted = false;
      this.showTwoFactorForm = false;
    });

    

    return;
  }
  get twoFactorformFields() {
    return this.twoFactorFormGroup.controls;
  }

  ngOnDestroy() {
    console.log('On Destroy, Unsubscribing socket connection');

    this.wsOmsService.unsubscribeAllOms(
      localStorage.getItem('userIdStorage'), 
      localStorage.getItem('sessionIdStorage'),
      localStorage.getItem('exchangeAccountId'));
  }
  clickedDiv() {
    console.log('clikced outside');
  }
  clickedInside() {
    console.log('clicked inside');
    return false;
  }

}
