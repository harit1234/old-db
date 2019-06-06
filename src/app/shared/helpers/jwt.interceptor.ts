import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../services/data.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RestService } from '../services/rest.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    jwtHelper = new JwtHelperService();
    constructor(private dataService: DataService, private restService: RestService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // const token = this.cookie.get('token');
        const token = localStorage.getItem('token');
        if (token) {
            
            if(this.jwtHelper.isTokenExpired(token) && !this.dataService.tokenRefreshing) {
                this.dataService.tokenRefreshing = true;
                this.restService.refreshToken().subscribe ( (refreshToken: any) => {
                    this.dataService.tokenRefreshing = false;
                    console.log('Refresh Token in jwt interceptor:::', );
                    localStorage.setItem('token', refreshToken.access_token);
                    return next.handle(request);
                });
            }
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }
}
