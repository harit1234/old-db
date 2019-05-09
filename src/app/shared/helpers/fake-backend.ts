import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const testUser = { email: 'jitu.mandal@gmail.com', password: 'Pass1w0rd', googleotp: 'test' };

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            // if (request.url.endsWith('login') && request.method === 'POST') {
            //     console.log(request.body.username);
            //     console.log(request.body.password);
            //     if (request.body.username === testUser.email && request.body.password === testUser.password) {
            //         // if login details are valid return 200 OK with a fake jwt token
            //         const body = {
            //             'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
            //             'expires_in': 3600,
            //             'Id': 10,
            //             'role': 'user',
            //             'email': testUser.email,
            //             'username': 'JITU_MANDAL_GMAIL_COM',
            //             'session_id': 'asdf234234234234234234234',
            //         };
            //         return of(new HttpResponse({ status: 200, body }));
            //     } else {
            //         // else return 400 bad request
            //         return throwError({ error: { message: 'Username or password is incorrect' } });
            //     }
            // }
            // pass through any requests not handled above
            return next.handle(request);

        }))

            // call materialize and dematerialize to ensure delay even
            // if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
