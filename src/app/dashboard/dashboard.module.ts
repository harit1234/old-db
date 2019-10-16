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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DipositComponent } from './diposit/diposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { SlicePipe } from '@angular/common';
import { TimetPipe } from '../shared/pipes/timet.pipe';
import { PricePipe } from '../shared/pipes/price.pipe';
import { QtyPipe } from '../shared/pipes/qty.pipe';
import { ActivityLogComponent } from './account/activity-log/activity-log.component';
import { DownloadComponent } from './download/download.component';
import { PageComponent } from './page/page.component';
import { MonetaryPipe } from '../shared/pipes/monetary.pipe';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { ApiSecretComponent } from './api-secret/api-secret.component';
import { AddressComponent } from './address/address.component';
import { NumericDirective } from '../shared/directives/numeric.directive';
import { DepositHistoryComponent } from './diposit/deposit-history/deposit-history.component';
import { WithdrawalHistoryComponent } from './withdraw/withdrawal-history/withdrawal-history.component';
import { WithdrawalStatusComponent } from './withdraw/withdrawal-history/withdrawal-status/withdrawal-status.component';
// import { GridModule, PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
// required for AOT compilation
export function httpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    TradeHistoryComponent,
    OrderHistoryComponent,
    DipositComponent,
    WithdrawComponent,
    ActivityLogComponent,
    DownloadComponent,
    PageComponent,
    LeaderboardComponent,
    AffiliateComponent,
    TimetPipe,
    QtyPipe,
    MonetaryPipe,
    PricePipe,
    ApiSecretComponent,
    AddressComponent,
    NumericDirective,
    DepositHistoryComponent,
    WithdrawalHistoryComponent,
    WithdrawalStatusComponent

  ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // GridModule,
    AgGridModule.withComponents([WithdrawalStatusComponent]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  // providers: [PageService, SortService, FilterService, GroupService],
  providers: [SlicePipe, TimetPipe, PricePipe, QtyPipe, MonetaryPipe]
})
export class DashboardModule { }
