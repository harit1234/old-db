import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../services/data.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private dataService: DataService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // const token = this.cookie.get('token');
        const token = this.dataService.authToken;
        // console.log("Token:::: ");
        // console.log(token);
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}
