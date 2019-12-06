import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryNoticeComponent } from './country-notice.component';

@NgModule({
  declarations: [CountryNoticeComponent],
  exports: [
    CountryNoticeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CountryNoticeModule { }
