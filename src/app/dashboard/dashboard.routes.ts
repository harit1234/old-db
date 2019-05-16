import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import {
    AuthGuardService as AuthGuard
} from '../shared/services/auth-guard.service';
import { AccountComponent } from './account/account.component';
import { SecurityComponent } from './security/security.component';
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
                path: 'home',
                component: HomeComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'security',
                component: SecurityComponent,
                canActivate: [AuthGuard]
            },
        ]

    }
];
