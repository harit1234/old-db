import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let testUser = {email: 'jitu.mandal@gmail.com', password: 'Pass1w0rd', googleotp: 'test'};

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
           
            // authenticate
            if (request.url.endsWith('login') && request.method === 'POST') {
                console.log(request.body.username);
                console.log(request.body.password);
                if (request.body.username === testUser.email && request.body.password === testUser.password) {
                    // if login details are valid return 200 OK with a fake jwt token
                    let body = {
                        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
                        "expires_in": 3600,
                        "Id":10,
                        "role":"user",
                        "email": testUser.email,
                        "username":"JITU_MANDAL_GMAIL_COM",
                        "session_id":"asdf234234234234234234234",
                    };
                    return of(new HttpResponse({ status: 200, body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            // if (request.url.endsWith('/users') && request.method === 'GET') {
            //     // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
            //     if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            //         return of(new HttpResponse({ status: 200, body: [testUser] }));
            //     } else {
            //         // return 401 not authorised if token is null or invalid
            //         return throwError({ error: { message: 'Unauthorised' } });
            //     }
            // }
            // if(request.url.endsWith('api/braintree/getclienttoken') && request.method === 'GET') {
            //     let language = { "token":"braintree_client_token_generated_on_your_servers" };
            //     return of(new HttpResponse({status: 200, body: language}));
            // }  
            // if(request.url.endsWith('/getLanguage/en') && request.method === 'GET') {
            //     let language = {
            //         "home": {
            //           "welcome": "Welcome to the ",
            //           "loadMoneyToCard": "LOAD MONEY TO CARD",
            //           "checkYourBalance": "CHECK YOU BALANCE"
            //         }
            //     };
            //     return of(new HttpResponse({status: 200, body: language}));
            // }

            // if(request.url.endsWith('/getLanguage/fr') && request.method === 'GET') {
            //     let language = {
            //         "home": {
            //           "welcome": "Bienvenue à la ",
            //           "loadMoneyToCard": "CHARGEMENT D'ARGENT SUR LA CARTE",
            //           "checkYourBalance": "VÉRIFIEZ VOTRE ÉQUILIBRE"
            //         }
            //     };
            //     return of(new HttpResponse({status: 200, body: language}));
            // }
            // if(request.url.endsWith('/getLanguage/se') && request.method === 'GET') {
            //     let language = {
            //         "home": {
            //           "welcome": "Välkommen till ",
            //           "loadMoneyToCard": "Ladda pengar till kort",
            //           "checkYourBalance": "KONTROLLERA BALANS"
            //         }
            //     };
            //     return of(new HttpResponse({status: 200, body: language}));
            // }

            // if(request.url.endsWith('api/card/GetCardInformation') && request.method === 'GET') {
            //     let cardInfo = {
            //         "cardInfo": [{
            //         "cardNumber": "3372545666",
            //         "name": "StigaAcc",
            //         "valid_From": "2019-03-05T14:45:00",
            //         "valid_To": "2019-03-31T14:45:00",
            //         "alwaysValid": 0,
            //         "amount": 60,
            //         "room": "",
            //         "doorAccessList": null,
            //         "accessRightsList": null
            //         }]
            //     };

            //     // let cardInfo = {
            //     //     "cardInfo": null,
            //     //     "error": "Could not get cardnumber"
            //     // }
            //     return of(new HttpResponse({status: 200, body: cardInfo}));
            // }

            // if(request.url.endsWith('/api/customer/GetCustomerSettings') && request.method === 'GET') {
            //     let customerSettings = {
            //         "currency": "SEK",
            //         "isCreditCardEnabled": true,
            //         "isSwishEnabled": true,
            //         "mailSettings": {
            //             "smtpServer": "smtp.mail.com",
            //             "port": 25,
            //             "username": "test@test.com",
            //             "password": "123",
            //             "ssl": true,
            //             "requiresAuthentication": true
            //         }
            //     };
            //     return of(new HttpResponse({status: 200, body: customerSettings}));
            // }

            // if(request.url.endsWith('api/customer/Getkiosk') && request.method === 'GET') {
            //     let commonSettings = [
            //         {
            //             "Description": "Kiosk 1",
            //             "DefaultLanguage": "en",
            //             "Amounts": [
            //                 {
            //                     "Description": "100 SEK",
            //                     "Amount": 100
            //                 },
            //                 {
            //                     "Description": "200 SEK",
            //                     "Amount": 200
            //                 },
            //                 {
            //                     "Description": "300 SEK",
            //                     "Amount": 300
            //                 },
            //                 {
            //                     "Description": "400 SEK",
            //                     "Amount": 400
            //                 }
            //             ],
            //             "Languages": [
            //                 {
            //                     "Description": "Svenska",
            //                     "Iso_Code": "se",
            //                     "Flag_Img": "assets/img/sweden-fleg.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "en",
            //                     "Flag_Img": "assets/img/Germany-flag.svg"
            //                 },
            //                 {
            //                     "Description": "Franc",
            //                     "Iso_Code": "fr",
            //                     "Flag_Img": "assets/img/Guadeloupe-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "gb",
            //                     "Flag_Img": "assets/img/Caribbean-Netherlands-flag.svg"
            //                 },
            //                 {
            //                     "Description": "Ireland",
            //                     "Iso_Code": "au",
            //                     "Flag_Img": "assets/img/Guadeloupe-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "aj",
            //                     "Flag_Img": "assets/img/Germany-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "jk",
            //                     "Flag_Img": "assets/img/Caribbean-Netherlands-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "lm",
            //                     "Flag_Img": "assets/img/Germany-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "pk",
            //                     "Flag_Img": "assets/img/Guadeloupe-flag.svg"
            //                 },
            //                 {
            //                     "Description": "English",
            //                     "Iso_Code": "jm",
            //                     "Flag_Img": "assets/img/Germany-flag.svg"
            //                 }
            //             ]
            //         }
            //     ];
            //     return of(new HttpResponse({status: 200, body: commonSettings}));
            // }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
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