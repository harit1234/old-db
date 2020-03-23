import { Component, OnInit } from "@angular/core";
import { DataService } from "../../shared/services/data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard-left-menu",
  templateUrl: "./dashboard-left-menu.component.html",
  styleUrls: ["./dashboard-left-menu.component.css"]
})
export class DashboardLeftMenuComponent implements OnInit {
  walletSlide = true;
  accountSlide = false;
  historySlide = false;

  optionsOpen = false;
  submenuOpen = false;

  selectedOption = "langDashboardLeftMenu.lblWallet";

  get selectedSubmenu() {
    let l = this.activeSubOptionsArray.length;
    for (let i = 0; i < l; i++) {
      let opt = this.activeSubOptionsArray[i];
      if (opt.rl == this.router.url) return opt;
    }
    this.router.navigateByUrl(this.activeSubOptionsArray[0].rl);
    return this.activeSubOptionsArray[0];
  }

  selectOption(opt) {
    this.selectedOption = opt;
    this.selectMenu();
    this.optionsOpen = false;
  }

  options = [
    "langDashboardLeftMenu.lblWallet",
    "langDashboardLeftMenu.lblAccPref",
    "langDashboardLeftMenu.lblHistory"
  ];

  walletOptions = [
    { d: "langDashboardLeftMenu.lblBalances", rl: "/dashboard/balances" },
    { d: "langDashboardLeftMenu.lblDeposit", rl: "/dashboard/deposits" },
    { d: "langDashboardLeftMenu.lblAddress", rl: "/dashboard/address" },
    { d: "langDashboardLeftMenu.lblWithdraw", rl: "/dashboard/withdraw" }
  ];

  accountOptions = [
    { d: "langDashboardLeftMenu.lblMyProfile", rl: "/dashboard/account" },
    { d: "langDashboardLeftMenu.lblSecurity", rl: "/dashboard/security" }
    // { d: "langDashboardLeftMenu.lblLeaderBoard", rl: "/dashboard/affiliate" },
    // { d: "langDashboardLeftMenu.lblApiSecret", rl: "/dashboard/apiSecret" }
  ];

  historyOptions = [
    { d: "langDashboardLeftMenu.lblTradeHist", rl: "/dashboard/tradeHistory" },
    { d: "langDashboardLeftMenu.lblOrdHist", rl: "/dashboard/orderHistory" }
  ];

  get activeSubOptionsArray(): any[] {
    if (this.walletSlide) return this.walletOptions;
    else if (this.accountSlide) return this.accountOptions;
    else if (this.historySlide) return this.historyOptions;
  }

  selectMenu() {
    switch (this.selectedOption) {
      case "langDashboardLeftMenu.lblWallet":
        this.walletSlide = true;
        this.accountSlide = false;
        this.historySlide = false;
        break;
      case "langDashboardLeftMenu.lblAccPref":
        this.walletSlide = false;
        this.accountSlide = true;
        this.historySlide = false;
        break;
      case "langDashboardLeftMenu.lblHistory":
        this.walletSlide = false;
        this.accountSlide = false;
        this.historySlide = true;
        break;
    }
  }

  selectPhoneSubMenu() {
    this.submenuOpen = false;
  }

  constructor(public dataService: DataService, public router: Router) {}
  ngOnInit() {
    console.log(this.router.url);
  }
}

/* 
    
*/
