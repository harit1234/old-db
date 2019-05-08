import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardLeftMenuComponent } from './dashboard-left-menu/dashboard-left-menu.component';
@NgModule({
  declarations: [
    LayoutComponent, 
    HomeComponent, 
    DashboardFooterComponent, 
    DashboardHeaderComponent, 
    DashboardLeftMenuComponent
  ],
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }
