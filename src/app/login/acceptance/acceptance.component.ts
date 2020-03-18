import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { DataService } from "src/app/shared/services/data.service";

@Component({
  selector: "app-acceptance",
  templateUrl: "./acceptance.component.html",
  styleUrls: ["./acceptance.component.css"]
})
export class AcceptanceComponent implements OnInit {
  constructor(private ds: DataService) {}

  loc1 = new FormControl(false);
  loc2 = new FormControl(false);
  loc3 = new FormControl(false);
  risk1 = new FormControl(false);
  risk2 = new FormControl(false);
  risk3 = new FormControl(false);
  liq1 = new FormControl(false);
  liq2 = new FormControl(false);
  usrAgreement = new FormControl(false);
  privacyPolicy = new FormControl(false);
  kyc = new FormControl(false);

  get registerAllowed() {
    return (
      this.usrAgreement.value &&
      this.kyc.value &&
      this.privacyPolicy.value &&
      this.liq1.value &&
      this.liq2.value &&
      this.loc1.value &&
      this.loc2.value &&
      this.loc3.value &&
      this.risk1.value &&
      this.risk2.value &&
      this.risk3.value
    );
  }

  ngOnInit() {}

  register() {
    if (this.registerAllowed) {
      this.ds.register(this.ds.registerData);
    }
  }
}
