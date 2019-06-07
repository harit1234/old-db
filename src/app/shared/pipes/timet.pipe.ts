import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { constants } from '../../../constants';

@Pipe({
  name: 'timet'
})
export class TimetPipe implements PipeTransform {
  private datePipe: DatePipe;
  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.datePipe = new DatePipe(locale);
  }

  transform(value: number): string {
    const date = new Date(value * 1000);
    return this.datePipe.transform(date, constants.TIME_FORMAT);
  }
}
