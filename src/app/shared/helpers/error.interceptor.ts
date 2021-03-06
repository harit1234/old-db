import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { TranslateService } from '@ngx-translate/core';

// import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private dataService: DataService,
        private translateService: TranslateService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            this.dataService.loader = false;
            if (err.status === 403) {
                // auto logout if 401 response returned from api
                // this.authenticationService.logout();
                console.log('Token Expired in error interceiptor');
                // this.dataService.refreshToken();
                // return;
                // location.reload(true);
            } else if (err.status === 400) {
                this.dataService.badRequestAction();
            }
            console.log('Error Status is :', err.status);
            console.log(err);
            let error = err.error.error || err.statusText;

            if (err.error.code) {
                console.log('Error code found!!');
                this.translateService.get('langServerError.' + err.error.code).subscribe(text => {
                    console.log('Translated error : ', text);
                    error = text;
                });
            }
            return throwError(error);
        }));
    }
}
