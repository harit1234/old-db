/**
 * @internal
 * @module WebSocketAPI
 */

import {IOhlcRequest} from '../interfaces/ohlc-request.interface';
import {IWebSocketAPIParam} from '../interfaces/web-socket-api-param.interface';

/**
 * Web-Socket API
 * @module WebSocketAPI
 * @internal
 */
export class WebSocketAPI {
    /**
     * @ignore
     */
    readonly username: string;
    /**
     * @ignore
     */
    readonly sessionId: string;

    private onopen: (ev: Event) => void;
    private onclose: (ev: CloseEvent) => void;
    private onmessage: (ev: MessageEvent) => void;
    private onerror: (ev: Event) => void;

    /**
     * @ignore
     */
    private ws: WebSocket;

    /** Creating new Web-Socket connection. */
    constructor(parameters: IWebSocketAPIParam) {
        this.ws = new WebSocket(parameters.url);

        this.username = parameters.username;
        this.sessionId = parameters.sessionId;

        if (parameters.options) {
            if (parameters.options.onopen) {
                this.setHandler('open', parameters.options.onopen);
            }

            if (parameters.options.onclose) {
                this.setHandler('close', parameters.options.onclose);
            }

            if (parameters.options.onerror) {
                this.setHandler('error', parameters.options.onerror);
            }

            if (parameters.options.onmessage) {
                this.setHandler('message', parameters.options.onmessage);
            }
        }
    }

    /**
     * @ignore
     */
    public get readyState() {
        return this.ws ? this.ws.readyState : WebSocket.CLOSED;
    }

    /**
     * Set handlers for Web-Socket events.
     * @param type
     * @param handler
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message)); // Listening for new messages from WebSocket
     * wsApi.setHandler('open', ev => console.log(ev)); // Listening for connection Open event
     * wsApi.setHandler('close', close => console.log(close)); // Listening for connection Close event
     * wsApi.setHandler('error', error => console.log(error)); // Listening for connection Error event
     * ```
     */
    public setHandler(type: 'open' | 'close' | 'error' | 'message', handler: (ev: Event | CloseEvent | MessageEvent) => void): void {
        if (typeof handler !== 'function') {
            throw new Error('Handler is not a function');
        }

        if (type === 'open') {
            this.onopen = this.ws.onopen = handler;
        }

        if (type === 'close') {
            this.onclose = this.ws.onclose = handler;
        }

        if (type === 'error') {
            this.onerror = this.ws.onerror = handler;
        }

        if (type === 'message') {
            this.onmessage = this.ws.onmessage = handler;
        }
    }

    /**
     * Subscribe for market depth levels updates via Web-Socket.
     *
     * @param type Subscription type
     * @param {string[]} symbols Array of Symbols to subscribe.
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message));
     *
     * // Subscribing for data updates.
     * wsApi.subscribe('depth', ['4AASP', '4AHWP']);
     * ```
     *
     * Web-Socket data messages example:
     *
     * First message is the Depth snapshot:
     *
     * ```xml
     * <get_depth_result>
     *     <depth>
     *         <Symbol>CLF9</Symbol>
     *         <SecurityId>101721</SecurityId>
     *         <DisplaySymbol>CLF9</DisplaySymbol>
     *         <Denominator>10000</Denominator>
     *         <buy_levels>
     *             <depth_level>
     *                 <Price>479900</Price>
     *                 <Qty>10</Qty>
     *             <NumOfOrders>1</NumOfOrders>
     *             </depth_level>
     *         </buy_levels>
     *         <sell_levels>
     *             <depth_level>
     *                 <Price>481600</Price>
     *                 <Qty>150</Qty>
     *                 <NumOfOrders>2</NumOfOrders>
     *             </depth_level>
     *             <depth_level>
     *                 <Price>481700</Price>
     *                 <Qty>193</Qty>
     *                 <NumOfOrders>2</NumOfOrders>
     *             </depth_level>
     *         </sell_levels>
     *     </depth>
     * </get_depth_result>
     * ```
     *
     * Next messages is the incremental updates for the snapshot:
     * ```xml
     * <get_depth_incremental>
     *     <Symbol>CLF9</Symbol>
     *     <SecurityId>101721</SecurityId>
     *     <DisplaySymbol>CLF9</DisplaySymbol>
     *     <Denominator>10000</Denominator>
     *     <updates>
     *         <depth_level>
     *             <Action>New</Action>
     *             <Side>Sell</Side>
     *             <Price>482300</Price>
     *             <Qty>38</Qty>
     *             <NumOfOrders>1</NumOfOrders>
     *         </depth_level>
     *         <depth_level>
     *             <Action>Change</Action>
     *             <Side>Sell</Side>
     *             <Price>482300</Price>
     *             <Qty>38</Qty>
     *             <NumOfOrders>1</NumOfOrders>
     *         </depth_level>
     *         <depth_level>
     *             <Action>Delete</Action>
     *             <Side>Sell</Side>
     *             <Price>482300</Price>
     *             <Qty>38</Qty>
     *             <NumOfOrders>1</NumOfOrders>
     *         </depth_level>
     *     </updates>
     * </get_depth_incremental>
     * ```
     *
     * Each depth level update contains Action `( New | Change | Delete )` which indicates what happened to the level.
     */
    public subscribe(type: 'depth', symbols: string[]): void;

    /**
     * Subscribe to the list of the latest market trades that contains trade qty, trade price, trade total value and the trade timestamp.
     * @param type Subscription type
     * @param {string[]} symbols Array of Symbols to subscribe.
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message));
     *
     * // Subscribing for data updates.
     * wsApi.subscribe('time_and_sales', ['4AASP', '4AHWP']);
     * ```
     *
     * Web-Socket data messages example:
     * ```xml
     * <get_times_and_sales_info_result>
     *     <time_and_sales_info>
     *     <Symbol>4AASP</Symbol>
     *     <SecurityId>1000000139</SecurityId>
     *     <DisplaySymbol>4AASP</DisplaySymbol>
     *     <Denominator>100</Denominator>
     *     <TimeAndSales>
     *         <TimeAndSale>
     *             <Price>19390</Price>
     *             <Qty>163</Qty>
     *             <TotalTradedVolume>826132</TotalTradedVolume>
     *             <SeqNum>69620</SeqNum>
     *             <Timestamp>2019-05-07 11:06:08.000</Timestamp>
     *         </TimeAndSale>
     *     </TimeAndSales>
     *     </time_and_sales_info>
     * </get_times_and_sales_info_result>
     * ```
     */
    public subscribe(type: 'time_and_sales', symbols: string[]): void;

    /**
     * Subscribe to instrument information changes such as: BestBidPrice, BestBidQty, BestOfferPrice, BestOfferQty, ClosePrice, OpenPrice, PreviousClosePrice, Description, LowPrice, HighPrice, LastTradePrice, LastTradeQty, LastTradeTimestamp, TotalTradedVolume and SettlementPrice.
     * @param type Subscription type
     * @param {string[]} symbols Array of Symbols to subscribe.
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message));
     *
     * // Subscribing for data updates.
     * wsApi.subscribe('price_info', ['4AASP', '4AHWP']);
     * ```
     *
     * Web-Socket data messages example:
     * ```xml
     * <get_price_info_result>
     *     <price_info>
     *         <Symbol>4AASP</Symbol>
     *         <BestBidPrice>19398</BestBidPrice>
     *         <BestBidQty>265</BestBidQty>
     *         <BestOfferPrice>19461</BestOfferPrice>
     *         <BestOfferQty>39</BestOfferQty>
     *         <ClosePrice>-2147483648</ClosePrice>
     *         <Denominator>100</Denominator>
     *         <Description></Description>
     *         <DisplaySymbol>4AASP</DisplaySymbol>
     *         <HighPrice>19601</HighPrice>
     *         <LastTradePrice>19398</LastTradePrice>
     *         <LastTradeQty>265</LastTradeQty>
     *         <LastTradeTimestamp>1557227833</LastTradeTimestamp>
     *         <LowPrice>19266</LowPrice>
     *         <OpenPrice>19395</OpenPrice>
     *         <PreviousClosePrice>19454</PreviousClosePrice>
     *         <SecurityId>1000000139</SecurityId>
     *         <SettlementPrice>19454</SettlementPrice>
     *         <SettlementPriceTimestamp>0</SettlementPriceTimestamp>
     *         <TotalTradedVolume>840017</TotalTradedVolume>
     *         <VWAP>1940829</VWAP>
     *     </price_info>
     * </get_price_info_result>
     * ```
     */
    public subscribe(type: 'price_info', symbols: string[]): void;

    /**
     * Subscribe for OHLC information updates via Web-Socket.
     * @param type Subscription type
     * @param {OhlcRequestModel} ohlc_request Parameters for OHLC subscription
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message));
     *
     * // Subscribing for OHLC data updates.
     * wsApi.subscribe('ohlc', {
     *     From: '2019-04-21 10:00:00',
     *     To: '2019-05-06 10:24:00',
     *     IntervalType: '15Min',
     *     Symbols: ['4AASP', '4AHWP']
     * });
     * ```
     *
     * Web-Socket data messages example:
     *
     * 1. For interval selected requests, e.g. `From: '2019-05-02 10:24:53.000'` `To: '2019-05-02 12:55:50.000'`.
     *```xml
     * <get_history_result>
     *     <Symbol>RBF9</Symbol>
     *     <SecurityId>816559</SecurityId>
     *     <DisplaySymbol>RBF9</DisplaySymbol>
     *     <Denominator>10000</Denominator>
     *     <IsRealtime>false</IsRealtime>
     *     <From>2019-05-02 10:24:53.000</From>
     *     <To>2019-05-02 12:55:50.000</To>
     *     <PriceType>LastTrade</PriceType>
     *     <IntervalType>15Sec</IntervalType>
     *     <Type>OhlcBars</Type>
     *     <Bars>
     *         <Bar>
     *             <Close>12800</Close>
     *             <High>12800</High>
     *             <Low>12800</Low>
     *             <Open>12800</Open>
     *             <Volume>0</Volume>
     *             <Timestamp>2019-05-02 10:25:00.000</Timestamp>
     *         </Bar>
     *         <Bar>
     *             <Close>12800</Close>
     *             <High>12800</High>
     *             <Low>12800</Low>
     *             <Open>12800</Open>
     *             <Volume>0</Volume>
     *             <Timestamp>2019-05-02 10:25:15.000</Timestamp>
     *         </Bar>
     *     </Bars>
     * </get_history_result>
     * ```
     *
     * 2. For realtime requests, e.g. `From: '2019-05-02 10:24:53.000'` `To: ''`
     * ```xml
     * <get_history_result>
     *     <Symbol>RBF9</Symbol>
     *     <SecurityId>816559</SecurityId>
     *     <DisplaySymbol>RBF9</DisplaySymbol>
     *     <Denominator>10000</Denominator>
     *     <IsRealtime>true</IsRealtime>
     *     <PriceType>LastTrade</PriceType>
     *     <IntervalType>15Sec</IntervalType>
     *     <Type>OhlcBars</Type>
     *     <Bars>
     *         <Bar>
     *             <Close>13400</Close>
     *             <High>13600</High>
     *             <Low>13400</Low>
     *             <Open>13600</Open>
     *             <Volume>255</Volume>
     *             <Timestamp>2019-05-02 12:54:45.000</Timestamp>
     *         </Bar>
     *     </Bars>
     * </get_history_result>
     * ```
     *
     */
    public subscribe(type: 'ohlc', ohlc_request: IOhlcRequest): void;
    public subscribe(type: 'depth' | 'time_and_sales' | 'price_info' | 'ohlc', symbols: string[] | IOhlcRequest): void {
        let ohlc_request: IOhlcRequest;

        if (!Array.isArray(symbols)) {
            ohlc_request = symbols as IOhlcRequest;
            symbols = ohlc_request.Symbols;
        }

        let data: { user: string, action: string, type: string, value: string[], interval?: string, from?: string, to?: string } = {
            user: this.username,
            action: 'subscribe',
            type: type,
            value: symbols,
        };

        if (type === 'ohlc') {
            data = {
                ...data,
                interval: ohlc_request.IntervalType,
                from: ohlc_request.From,
                to: ohlc_request.To,
            };
        }

        return this.ws.send(JSON.stringify(data));
    }

    /**
     * Un-Subscribe from Web-Socket data updates
     *
     * Code example:
     * ```typescript
     * const wsApi = new WebSocketWrapper({url: 'ws://urt_to_server', username: 'USERNAME'});
     *
     * // Setting logging wsApi messages to console.
     * wsApi.setHandler('message', message => console.log(message));
     *
     * // Subscribing for data updates.
     * wsApi.subscribe('price_info', ['4AASP', '4AHWP']);
     * wsApi.subscribe('depth', ['4AASP', '4AHWP']);
     *
     * // Un-subscribing from updates for price_info for 4AASP symbol.
     * wsApi.unsubscribe('price_info', ['4AASP']);
     * ```
     */
    public unsubscribe(type: 'depth' | 'time_and_sales' | 'price_info', symbols: string[]): void;
    public unsubscribe(type: 'ohlc', symbols: string[], interval: string): void;
    public unsubscribe(type: 'depth' | 'time_and_sales' | 'price_info' | 'ohlc', symbols: string[], interval?: string): void {
        let data: { user: string, action: string, type: string, value: string[], interval?: string } = {
            user: this.username,
            action: 'unsubscribe',
            type: type,
            value: symbols,
        };

        if (type === 'ohlc') {
            data = {
                ...data,
                interval: interval,
            };
        }

        return this.ws.send(JSON.stringify(data));
    }

    /** Enqueues data to be transmitted. */
    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        return this.ws.send(data);
    }

    /** Closes the connection. */
    public close(code?: number, reason?: string): void {
        return this.ws.close(code, reason);
    }
}
