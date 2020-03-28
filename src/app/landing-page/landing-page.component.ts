import { Component, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"]
})
export class LandingPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  launchDate: Date = new Date("4 Jul 2020");

  timerString: string;

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["dashboard"]);
    }
    console.log(this.launchDate);
    setInterval(() => {
      this.timerString = this.getRunningTimer();
    }, 1000);
  }

  getRunningTimer() {
    let deadLine: Date = this.launchDate;
    var today = new Date();
    var hours = today.getUTCHours();

    let distance = deadLine.getTime() - today.getTime();

    let daysToShow = Math.floor(distance / (1000 * 60 * 60 * 24));

    let hoursToShow = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return (
      daysToShow + "D:" + hoursToShow + "H:" + minutes + "M:" + seconds + "S"
    );
  }
}
