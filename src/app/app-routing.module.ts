import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { ForgotComponent } from './login/forgot/forgot.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmailVerificationComponent } from './login/email-verification/email-verification.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ActivateAccountComponent } from './login/activate-account/activate-account.component';
//import { DownloadComponent } from './download/download.component';

const routes: Routes = [
  {path: '' , redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'login' , component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'emailVerification', component: EmailVerificationComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'resetPassword', component: ResetPasswordComponent},
  {path: 'activateAccount', component: ActivateAccountComponent},
  {path: '**', component: PageNotFoundComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
