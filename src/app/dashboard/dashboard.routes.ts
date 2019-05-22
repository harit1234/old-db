import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import {
    AuthGuardService as AuthGuard
} from '../shared/services/auth-guard.service';
import { AccountComponent } from './account/account.component';
import { SecurityComponent } from './security/security.component';
import { DipositComponent } from './diposit/diposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'account', pathMatch: 'full' },
            {
                path: 'account',
                component: AccountComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'balances',
                component: HomeComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'deposits',
                component: DipositComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'withdraw',
                component: WithdrawComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'security',
                component: SecurityComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'tradeHistory',
                component: TradeHistoryComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'orderHistory',
                component: OrderHistoryComponent,
                canActivate: [AuthGuard]
            },
        ]

    }
];
