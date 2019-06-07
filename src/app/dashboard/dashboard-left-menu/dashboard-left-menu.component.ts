import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-dashboard-left-menu',
  templateUrl: './dashboard-left-menu.component.html',
  styleUrls: ['./dashboard-left-menu.component.css']
})
export class DashboardLeftMenuComponent implements OnInit {
  walletSlide = true;
  accountSlide = true;
  historySlide = true;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }
}
