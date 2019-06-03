import { Pipe, PipeTransform } from '@angular/core';
import {InstrumentModel} from '../models/instrument-model';
import {constants} from '../../../constants';

@Pipe({
  name: 'qty'
})
export class QtyPipe implements PipeTransform {
  transform(value: number, instr: InstrumentModel): string {

    if (value == null || value.toString() === constants.INT_MIN) {
      return '';
    }
    if (instr == null) {
      return '"' + value + '"';
    }
    let digits = 0;
    const denom: number =  Number(instr.QtyDenominator);
    switch (denom) {
      case 1: digits = 0; break;
      case 10: digits = 1; break;
      case 100: digits = 2; break;
      case 1000: digits = 3; break;
      case 10000: digits = 4; break;
      case 100000: digits = 5; break;
      case 1000000: digits = 6; break;
      case 10000000: digits = 7; break;
      case 100000000: digits = 8; break;
    }
    return (value / denom).toFixed(digits);
  }
}
