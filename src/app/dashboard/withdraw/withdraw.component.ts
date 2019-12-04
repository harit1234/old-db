import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { constants } from '../../../constants';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { WebSocketOmsService } from '../../shared/services/web-socket-oms.service';
import { AccountModel } from '../../models/account-model';
import { TranslateService } from '@ngx-translate/core';

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
  msgSuccess = '';
  googleFaStatus = false;
  showTwoFactorForm = false;
  withdrawalRequestStatus = false;
  defaultCurrency:string;
  minWithdrawalAmount: any;
  defaultWithdrawalFee:any;
  tradingBalance:any;
  availableBalance:any;
  amountGreaterStatus = false;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.showTwoFactorForm = false;
  }

  constructor(
    private withdrawFormBuilder: FormBuilder,
    private twoFactorFormBuilder:FormBuilder,
    public dataService: DataService,
    private restService: RestService,
    public pricePipe:PricePipe,
    private wsOmsService: WebSocketOmsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {

    this.dataService.accountSubject.subscribe( (accountInfo: AccountModel) => {
      //this.tradingBalance = parseFloat(accountInfo.UnusedMargin.toString()).toFixed(8);
      this.availableBalance = parseFloat(accountInfo.UnusedMargin.toString()).toFixed(8);
      this.tradingBalance = this.availableBalance;
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
      'comment': ['']
    });
    this.twoFactorFormGroup = this.twoFactorFormBuilder.group({'otp': ['', Validators.required]});
    this.defaultCurrency = constants.DEFAULT_CURRENCY;
  }

  /**
   * Initializing the web socket connection to get the available amount
   */
  initiateWebSocketConnection() {
    console.log('Getting Account Info....');
    this.dataService.loader = true;
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getAccountBalance(data).subscribe((balanceInfo :any) => {

      console.log('Initiating web socket connection....');
      this.availableBalance = parseFloat(balanceInfo.account.UnusedMargin.toString()).toFixed(8);
      this.tradingBalance = this.availableBalance;
      this.formFields.tradingBalance.setValue(this.tradingBalance);
      this.formFields.available.setValue(this.availableBalance);

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

    this.amountGreaterStatus = this.checkForAmountGreater();
    
    if (this.withdrawFormGroup.invalid || this.amountGreaterStatus) {
      
      if(this.amountGreaterStatus) {
        this.formFields.amount.setValue(this.availableBalance);
      }
      console.log('Invalid');
      return;
    }
    this.showTwoFactorForm = true;
    return;
  }

  checkForAmountGreater() {
    
    const firstValue = parseFloat(this.formFields.amount.value);
    const secondValue = parseFloat(this.formFields.available.value);
    // set error on matchingControl if validation fails
    if (secondValue < firstValue) {
        return true;
    }
    return false; 
  }

  sendWithdrawData() {
    const data = {
      'address': this.formFields.address.value,
      'symbol': constants.DEFAULT_CURRENCY,
      'amount': this.formFields.amount.value,
      'comment': this.formFields.comment.value
    };
    this.dataService.loader = true;
    this.restService.sendWithdrawalRequest(data).subscribe( (withdrawSatus:any) => {
      this.dataService.loader = false;
      this.withdrawalRequestStatus = true;
      this.submitted = false;
      this.withdrawFormGroup.reset();
      this.translateService.get('langServerSuccess.' + withdrawSatus.data.code).subscribe(text => {
        console.log('Translated error : ', text);
        this.msgSuccess = text;
      });

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
      this.twoFASubmitted = false;
      this.twoFactorFormGroup.reset();
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

  hidePopup() {
    this.twoFactorFormGroup.reset();
    this.twoFASubmitted = false;
    this.showTwoFactorForm = false;
  }

}
