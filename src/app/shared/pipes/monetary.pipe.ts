import { Pipe, PipeTransform } from '@angular/core';
import {InstrumentModel} from '../models/instrument-model';
import {constants} from '../../../constants';

@Pipe({
  name: 'monetary'
})
export class MonetaryPipe implements PipeTransform {
  transform(value: number, currency: string, kind: string): string {

    if (value == null || value.toString() === constants.INT_MIN) {
      return '';
    }
    if (currency == null || currency === '') {
      currency = '0';
    }
    if (kind == null || kind === '') {
      kind = '0';
    }
    let currency_map = constants.MONETARY_FORMATTING[currency];
    if (currency_map == null) {
      currency_map = constants.MONETARY_FORMATTING['0'];
    }

    let digits = currency_map[kind];
    if (digits == null) {
      digits = currency_map['0'];
    }
    return (value / 1).toFixed(digits);
  }
}
