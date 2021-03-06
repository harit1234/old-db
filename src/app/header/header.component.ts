import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component2.css"]
})
export class HeaderComponent implements OnInit {
  openMenuClass = false;
  constructor(private router: Router) {}
  public currentUrl = "";
  ngOnInit() {
    this.currentUrl = this.router.url; /// this will give you current url
  }
  navigateToBfx() {
    this.router.navigateByUrl("bfx");
  }
}
