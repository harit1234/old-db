import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import {
    AuthGuardService as AuthGuard
} from '../shared/services/auth-guard.service';
export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [AuthGuard]
            },
        ]

    }
];
