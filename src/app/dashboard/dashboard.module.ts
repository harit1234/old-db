import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
@NgModule({
  declarations: [LayoutComponent, HomeComponent],
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }
