/**
 * @module Services
 */

import {Injectable, NgZone} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {AuthService} from './auth.service';
// import {AppConfig} from '../../app.config';
import {Observable} from 'rxjs';
import {constants} from '../../../constants';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketOmsService extends WebSocketService {

    constructor(protected auth: AuthService, protected zone: NgZone) {
        super(auth, zone);
    }

    protected get connectionUrl() {
        console.log(environment.wssOMSURL);
        return environment.wssOMSURL;
    }

    public init() {
        if (constants.APP_USE_OMS_SERVER) {
            super.init();
        }
    }

    // protected connect() {
    //     super.connect();
    //
    //     this.ws.setHandler('message', message => this._onMessage.next(message));
    // }

    public subscribeForOrders(session, user, account) {
        this.subscribeOSS(session, user, account, 'orders');
    }

    public subscribeForAccounts(session, user, account) {
        this.subscribeOSS(session, user, account, 'accounts');
    }

    public subscribeForTrades(session, user, account) {
        this.subscribeOSS(session, user, account, 'trades');
    }

    public subscribeForPositions(session, user, account) {
        this.subscribeOSS(session, user, account, 'positions');
    }

    private subscribeOSS(session, user, account, type: 'orders' | 'trades' | 'accounts' | 'positions' | 'OrdersAndTrades' | 'AccountsAndPositions'): Observable<any> {
        const data = {
            'user_id': user,
            'session_id': session,
            'action': 'subscribe',
            'type': type,
            'account': account
        };
        if (this.isConnected()) {
            this.ws.send(JSON.stringify(data));
            this.activeRequests.push(data);
        } else {
            this.pendingRequests.push(data);
        }
        return this.onMessage;
    }

    public subscribeAllOms(userId: string, sessionId: string, account: string): Observable<any> {
        this.activeRequests = [];

        this.subscribeForAccounts(sessionId, userId, account);
        this.subscribeForOrders(sessionId, userId, account);
        this.subscribeForTrades(sessionId, userId, account);
        this.subscribeForPositions(sessionId, userId, account);

        return this.onMessage;
    }

    public unsubscribeAllOms(userId: string, sessionId: string, account: any) {

    }
}
