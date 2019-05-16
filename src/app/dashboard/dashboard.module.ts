import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardLeftMenuComponent } from './dashboard-left-menu/dashboard-left-menu.component';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { SecurityComponent } from './security/security.component';
import { ChangePasswordComponent } from './security/change-password/change-password.component';
import { GoogleAuthComponent } from './security/google-auth/google-auth.component';
@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    DashboardFooterComponent,
    DashboardHeaderComponent,
    DashboardLeftMenuComponent,
    AccountComponent,
    SecurityComponent,
    ChangePasswordComponent,
    GoogleAuthComponent,
  ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule
  ]
})
export class DashboardModule { }
