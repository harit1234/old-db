import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from "../../shared/services/data.service";
import { MustMatch } from "../../shared/helpers/must-match.validator";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { RestService } from "../../shared/services/rest.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;
  submitted = false;
  error = "";
  constructor(
    private registerFormBuilder: FormBuilder,
    public dataService: DataService,
    private route: ActivatedRoute,
    private restService: RestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerFormGroup = this.registerFormBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*/
            )
          ]
        ],
        confirmPassword: ["", Validators.required],
        country: ["", Validators.required],
        firstName: [""],
        lastName: [""],
        terms: [true, Validators.requiredTrue],
        recaptcha: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );

    if (this.route.snapshot.queryParams["ref"]) {
      localStorage.setItem("refId", this.route.snapshot.queryParams["ref"]);
    }

    this.dataService.getCountryList();
  }

  /**
   * Gets the recaptha key
   */
  get siteKey() {
    return environment.recaptchaKey;
    // return AppConfig.settings.recaptchaKey;
  }
  // convenience getter for easy access to form fields
  get formFields() {
    return this.registerFormGroup.controls;
  }

  /**
   * Submit form action data
   */

  onSubmit() {
    this.dataService.registerError = null;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.submitted = true;
    console.log(this.formFields);
    const data = {
      email: this.formFields.email.value,
      password: this.formFields.password.value,
      password_confirmation: this.formFields.password.value,
      country: this.formFields.country.value,
      first_name: this.formFields.firstName.value,
      last_name: this.formFields.lastName.value,
      terms: this.formFields.terms.value,
      timezone: timeZone || null,
      ref_id: localStorage.getItem("refId")
    };

    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      // this.dataService.loader = false;
      console.log("Invalid");
      return;
    }
    console.log("Form Submitted!!");

    console.log(
      "SUCCESS!! :-)\n\n" + JSON.stringify(this.registerFormGroup.value)
    );

    this.dataService.registerData = data;

    this.router.navigateByUrl("/agreement");

    // this.dataService.register(data);
  }

  /**
   * Recaptcha is loading
   */
  handleLoad() {
    console.log("Captcha loading");
  }

  /**
   * After recapcha sucess function
   * @param event returns the key
   */
  handleSuccess(event: any) {
    console.log(event);
  }
}
