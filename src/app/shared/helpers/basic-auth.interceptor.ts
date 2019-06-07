import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUser = 'idap:idap_5775';

        request = request.clone({
            setHeaders: {
                Authorization: `Basic ${window.btoa('idap:idap_5775')}`
            }
        });
        return next.handle(request);
    }
}
