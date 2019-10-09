/**
 * @module Services
 */

import {Injectable, NgZone} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {AuthState, WsState} from '../enums';
import {AuthService} from './auth.service';
import { environment } from '../../../environments/environment';
import {WebSocketAPI} from './web-socket-api';
import {filter, map} from "rxjs/operators";
import * as xml2js from "xml2js";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    public parser = new xml2js.Parser({explicitArray: false});

    // protected subject: Subject<MessageEvent>;
    protected ws: WebSocketAPI;
    protected _username: string;

    protected get connectionUrl() {
        return environment.restUrl;
    }

    public get username(): string {
        //return this._username || this.auth.userId;
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }

    
    protected pendingRequests = [];
    protected activeRequests = [];

    private ohlcSubs: {[key: string]: {symbol: string, observer: Subscription, resolution: string}} = {};

    public availableSymbols: string[];

    protected _onMessage: Subject<any> = new Subject<any>();
    public onMessage: Observable<any> = this._onMessage.asObservable().pipe(map(message => {
        let tmp;
        this.parser.parseString(message.data, (err, result) => {
            tmp = result;
        });
        const eventName = Object.keys(tmp)[0];
        return {event: eventName, data: tmp[eventName]};
    }));

    protected _state: WsState = WsState.Closed;
    public get state() {
        return this._state;
    }

    protected _stateChanged: Subject<WsState> = new Subject<WsState>();
    public stateChanged: Observable<WsState> = this._stateChanged.asObservable();

    constructor(protected auth: AuthService, protected zone: NgZone) {
        this.init();
    }

    public init() {
        this.auth.stateChanged.subscribe((state: AuthState) => {
            if (state === AuthState.LOGGED_IN) {
                this.connect();
            } else if (state === AuthState.LOGGED_OUT) {
                this.disconnect();
            }
        });

        this.stateChanged.subscribe((state: WsState) => {
            if (state === WsState.Open) {
                for (const sub of this.pendingRequests) {
                    this.ws.send(JSON.stringify(sub));
                    this.activeRequests.push(sub);
                }
                this.pendingRequests = [];

                if (this.availableSymbols) {
                    this.subscribeForPriceInfo(this.availableSymbols);
                }
            } else if (state === WsState.Closed) {
                if (this.auth.state === AuthState.LOGGED_IN) {
                    this.pendingRequests = this.activeRequests.concat(this.pendingRequests);
                    this.activeRequests = [];
                    setTimeout(() => this.connect(), 2000);
                }
            } else if (state === WsState.Error) {
                this.disconnect();
            }
        });
    }

    protected connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.ws = new WebSocketAPI({
            url: this.connectionUrl, username: this.username, options: {
                onopen: () => this.setState(WsState.Open),
                onclose: () => this.setState(WsState.Closed),
                onerror: () => this.setState(WsState.Error)
            }
        });

        this.zone.runOutsideAngular(() => this.ws.setHandler('message', message => this._onMessage.next(message)));
    }

    private setState(state: WsState) {
        if (this._state !== state) {
            this._state = state;
            this._stateChanged.next(state);
        }
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

    }

    public isConnected(): boolean {
        return this.ws != null && this.ws.readyState === WebSocket.OPEN;
    }


    public subscribeAll(symbol: string): Observable<any> {
        this.activeRequests = [];

        this.subscribeForDepth(symbol);
        this.subscribeForTimesAndSales(symbol);

        return this.onMessage;
    }

    public unsubscribeAll(symbol: string): Observable<any> {
        this.activeRequests = [];

        this.unsubscribeForTimesAndSales(symbol);
        this.unsubscribeForDepth(symbol);

        return this.onMessage;
    }

    /**
     * Subscribes for depth updates
     *
     * @param {string} symbol Target symbol.
     * @returns {observable} Returns current web-socket observable.
     */
    public subscribeForDepth(symbol: string): Observable<any> {
        const data = {
            'user': this.username,
            'action': 'subscribe',
            'type': 'depth',
            'value': [symbol]
        };
        if (this.isConnected()) {
            this.ws.send(JSON.stringify(data));
            this.activeRequests.push(data);
        } else {
            this.pendingRequests.push(data);
        }
        return this.onMessage.pipe(filter(pack => pack.event));
    }

    public unsubscribeForDepth(symbol: string): Observable<any> {
        if (this.isConnected()) {
            const data = {
                'user': this.username,
                'action': 'unsubscribe',
                'type': 'depth',
                'value': [symbol]
            };
            this.ws.send(JSON.stringify(data));
        }
        return this.onMessage;
    }

    public subscribeForTimesAndSales(symbol: string): Observable<any> {
        const data = {
            'user': this.username,
            'action': 'subscribe',
            'type': 'time_and_sales',
            'value': [symbol]
        };
        if (this.isConnected()) {
            this.ws.send(JSON.stringify(data));
            this.activeRequests.push(data);
        } else {
            this.pendingRequests.push(data);
        }
        return this.onMessage;
    }

    public unsubscribeForTimesAndSales(symbol: string): Observable<any> {
        if (this.isConnected()) {
            const data = {
                'user': this.username,
                'action': 'unsubscribe',
                'type': 'time_and_sales',
                'value': [symbol]
            };
            this.ws.send(JSON.stringify(data));
        }
        return this.onMessage;
    }

    public subscribeForPriceInfo(symbols: string | string[]): Observable<any> {
        const data = {
            'user': this.username,
            'action': 'subscribe',
            'type': 'price_info',
            'value': typeof symbols === 'string' ? [symbols] : symbols
        };

        if (this.isConnected()) {
            this.ws.send(JSON.stringify(data));
        } else {
            this.availableSymbols = data.value;
        }

        return this.onMessage;
    }

    public unsubscribeForPriceInfo(symbol: string): Observable<any> {
        if (this.isConnected()) {
            const data = {
                'user': this.username,
                'action': 'unsubscribe',
                'type': 'price_info',
                'value': [symbol]
            };
            this.ws.send(JSON.stringify(data));
        }
        return this.onMessage;
    }

    
}

