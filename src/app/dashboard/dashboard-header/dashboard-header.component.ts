import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
})
export class DashboardHeaderComponent implements OnInit {
  // hamburgerMenuStatus = false;
  // @Output() hanburgerMenuOpened = new EventEmitter<boolean>();
  userName: string;
  constructor(
    public dataService: DataService,
    public authService: AuthService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('email');
  }

  /**
   * Hamberger menu action on mobile version
   */
  hamburger() {
    // this.hamburgerMenuStatus = !this.hamburgerMenuStatus;
    // console.log(this.hamburgerMenuStatus);

    this.dataService.hambergerMenuStatus = !this.dataService.hambergerMenuStatus;
    // Passed message to parent component (layout component)
    // this.hanburgerMenuOpened.emit(this.dataService.hambergerMenuStatus);
  }
}
