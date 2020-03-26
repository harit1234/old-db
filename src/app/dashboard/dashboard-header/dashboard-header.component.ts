import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { DataService } from "../../shared/services/data.service";
import { AuthService } from "../../shared/services/auth.service";
import { constants } from "../../../constants";

@Component({
  selector: "app-dashboard-header",
  templateUrl: "./dashboard-header.component.html",
  styleUrls: ["./dashboard-header.component.css"]
})
export class DashboardHeaderComponent implements OnInit {
  @Input()
  clickEmitter: EventEmitter<any>;

  languages: any;
  userName: string;
  constructor(
    public dataService: DataService,
    public authService: AuthService
  ) {}

  userDropDown: boolean = false;

  handleUserIconClick(e: Event) {
    e.stopPropagation();
    this.userDropDown = !this.userDropDown;
  }

  ngOnInit() {
    this.userName = localStorage.getItem("email");
    this.languages = constants.WEBSITE_LANGUAGE;
    this.clickEmitter.subscribe(d => {
      this.userDropDown = false;
    });
    console.log(this.languages);
  }

  /**
   * Hamberger menu action on mobile version
   */
  hamburger() {
    // this.hamburgerMenuStatus = !this.hamburgerMenuStatus;
    // console.log(this.hamburgerMenuStatus);

    this.dataService.hambergerMenuStatus = !this.dataService
      .hambergerMenuStatus;
    // Passed message to parent component (layout component)
    // this.hanburgerMenuOpened.emit(this.dataService.hambergerMenuStatus);
  }

  handleMenu(e) {
    e.stopPropagation();
    this.dataService.phoneMenu = !this.dataService.phoneMenu;
  }
}
