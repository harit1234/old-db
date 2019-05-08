import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { SidePanelComponent } from './login/side-panel/side-panel.component';
import { LoginFooterComponent } from './login/login-footer/login-footer.component';
import { RegisterComponent } from './login/register/register.component';
import { ForgotComponent } from './login/forgot/forgot.component';
import { LoginLogoComponent } from './login/login-logo/login-logo.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor } from './shared/helpers';
import { DashboardModule } from './dashboard/dashboard.module';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
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
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    HttpClientModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
