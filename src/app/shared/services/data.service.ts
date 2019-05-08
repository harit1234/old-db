import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  authToken: string;
  constructor() { }

  /**
   * Bad request error handing
   */
  badRequestAction() {
    console.log('bad request');
  }
}
