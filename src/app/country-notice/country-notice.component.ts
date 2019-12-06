import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-country-notice',
  templateUrl: './country-notice.component.html',
  styleUrls: ['./country-notice.component.css']
})
export class CountryNoticeComponent implements OnInit {

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

}
