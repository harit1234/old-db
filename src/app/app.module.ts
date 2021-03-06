import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { AppConfig } from "./app.config";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { AppRoutingModule } from "./app-routing.module";
import { SidePanelComponent } from "./login/side-panel/side-panel.component";
import { LoginFooterComponent } from "./login/login-footer/login-footer.component";
import { RegisterComponent } from "./login/register/register.component";
import { ForgotComponent } from "./login/forgot/forgot.component";
import { LoginLogoComponent } from "./login/login-logo/login-logo.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxCaptchaModule } from "ngx-captcha";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import {
  JwtInterceptor,
  ErrorInterceptor,
  FakeBackendInterceptor
} from "./shared/helpers";
import { DashboardModule } from "./dashboard/dashboard.module";
import { EmailVerificationComponent } from "./login/email-verification/email-verification.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";
import { JwtModule } from "@auth0/angular-jwt";
import { ActivateAccountComponent } from "./login/activate-account/activate-account.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppLoaderComponent } from "./app-loader/app-loader.component";
import { WithdrawalConfirmComponent } from "./withdrawal-confirm/withdrawal-confirm.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { CommonModule } from "@angular/common";
import { BfxComponent } from "./bfx/bfx.component";
import { CountryNoticeModule } from "./country-notice/country-notice.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AcceptanceComponent } from './login/acceptance/acceptance.component';
export function initializeApp(appConfig: AppConfig) {
  return () => {
    appConfig.load();
    // JwtModule.forRoot({
    //   config: {
    //     whitelistedDomains: ['localhost:3001', 'foo.com', 'bar.com']
    //   }
    // });
  };
}

// required for AOT compilation
export function httpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidePanelComponent,
    LoginFooterComponent,
    RegisterComponent,
    ForgotComponent,
    LoginLogoComponent,
    PageNotFoundComponent,
    EmailVerificationComponent,
    ResetPasswordComponent,
    ActivateAccountComponent,
    AppLoaderComponent,
    WithdrawalConfirmComponent,
    LandingPageComponent,
    FooterComponent,
    HeaderComponent,
    BfxComponent,
    AcceptanceComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    DashboardModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    HttpClientModule,
    MatSlideToggleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule,
    CountryNoticeModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule

    // JwtModule.forRoot({
    //   config: {
    //     whitelistedDomains: ['localhost:3001', 'foo.com', 'bar.com']
    //   }
    // })
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
