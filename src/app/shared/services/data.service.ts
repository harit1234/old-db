import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  loader = false;
  constructor(private restService: RestService) { }


  // login(data: any) {
  //   localStorage.setItem('token','asdfasf');
  //   this.restService.login(data).subscribe( val => {
  //         console.log('response');
  //         console.log(val);
  //     }, error => {
  //       this.dataService.loader = false;
  //       this.error = error;
  //     });
  // }

  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
}
