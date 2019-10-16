import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { constants } from '../../../constants';

@Component({
  selector: 'app-diposit',
  templateUrl: './diposit.component.html',
  styleUrls: ['./diposit.component.css']
})
export class DipositComponent implements OnInit {

  addressGeneratedStaus = false;
  createdAddress:string;
  coinsArray = [];
  createAddressGroup: FormGroup;
  submitted = false;
  error = '';
  copiedAddress = false;

  constructor(
    private createAddressFormBuilder: FormBuilder,
    public dataService: DataService,
    public restService: RestService) { }

  ngOnInit() {

    let addressGenerated = localStorage.getItem('walletAddress');
    addressGenerated = JSON.parse(addressGenerated);
    
    if(addressGenerated && addressGenerated[constants.DEFAULT_CURRENCY] === true) {
      this.addressGeneratedStaus = addressGenerated[constants.DEFAULT_CURRENCY];
    }
    
    
    if(this.addressGeneratedStaus !== true) {
      this.getCurrencies();
    }else {
      const data = {'coin': constants.DEFAULT_CURRENCY};
      this.getAddress(data);
    }
    this.createAddressGroup = this.createAddressFormBuilder.group({
      'coin': [Validators.required],
    });
    this.createAddressGroup.controls['coin'].setValue(constants.DEFAULT_CURRENCY, {onlySelf: true});
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
        });
      }
    }, error => {
      this.error = error;
      console.log("error sis: ", error);
    });
  }
  

  onSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.createAddressGroup.invalid) {
      console.log('Invalid');
      return;
    }

    const data = {'coin': this.formFields.coin.value};
    this.getAddress(data);
  }

  getAddress(data:any) {
    //return;
    setTimeout(() => { this.dataService.loader = true;});
    this.restService.getAddress(data).subscribe(addressInfo => {
      this.dataService.loader = false;
      
      console.log('Address Result:', addressInfo);
      this.addressGeneratedStaus = true;
      this.createdAddress = addressInfo.data.address;
      localStorage.setItem('walletAddress', '{"'+addressInfo.data.symbol+'": true}');
    }, error => {

      console.log('errorrrrr');
      this.createAddressGroup.reset();
      this.submitted = false;
      this.error = error;
      console.log('errorrrrr', this.error);
    });
  }
  // convenience getter for easy access to form fields
  get formFields() {
    return this.createAddressGroup.controls;
  }

  copyRefererLink(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copiedAddress = true;
    setTimeout(() => {
      this.copiedAddress = false;
    }, 5000);

  }
}
