import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
})
export class DashboardHeaderComponent implements OnInit {
  hamburgerMenuStatus = false;
  @Output() hanburgerMenuOpened = new EventEmitter<boolean>();

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  /**
   * Hamberger menu action on mobile version
   */
  hamburger() {
    this.hamburgerMenuStatus = !this.hamburgerMenuStatus;

    // Passed message to parent component (layout component)
    this.hanburgerMenuOpened.emit(this.hamburgerMenuStatus);
  }
}
