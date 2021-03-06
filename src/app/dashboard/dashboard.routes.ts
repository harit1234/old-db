import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuardService as AuthGuard } from "../shared/services/auth-guard.service";
import { AccountComponent } from "./account/account.component";
import { SecurityComponent } from "./security/security.component";
import { DipositComponent } from "./diposit/diposit.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { TradeHistoryComponent } from "./trade-history/trade-history.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";
import { DownloadComponent } from "./download/download.component";
import { AffiliateComponent } from "./affiliate/affiliate.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { PageComponent } from "./page/page.component";
import { ApiSecretComponent } from "./api-secret/api-secret.component";
import { AddressComponent } from "./address/address.component";
export const dashboardRoutes: Routes = [
  {
    path: "dashboard",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "account", pathMatch: "full" },
      {
        path: "account",
        component: AccountComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "balances",
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "deposits",
        component: DipositComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "withdraw",
        component: WithdrawComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "address",
        component: AddressComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "security",
        component: SecurityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "tradeHistory",
        component: TradeHistoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "orderHistory",
        component: OrderHistoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "download",
        component: DownloadComponent,
        canActivate: [AuthGuard]
      },
      //   {
      //     path: "affiliate",
      //     component: AffiliateComponent,
      //     canActivate: [AuthGuard]
      //   },
      {
        path: "leaderboard",
        component: LeaderboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "apiSecret",
        component: ApiSecretComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: "page/:page",
    component: PageComponent
  }
];
