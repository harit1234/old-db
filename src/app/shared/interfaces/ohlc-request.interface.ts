/**
 * @internal
 * @module WebSocketAPI
 */


/**
 * @internal
 * @module WebSocketAPI
 */
export interface IOhlcRequest {

    /** Array of needed symbols: `['4AASP', '4AHWP']` **/
    Symbols: string[];

    /** OHLC bars interval. Should be one of `['15S', '1', '5', '15', '60']`*/
    IntervalType: string;

    /** Start date. Example: `From: 2019-05-02 10:24:53`**/
    From: string;

    /** End date. For real-time updates should be empty string: `To: ''` or the end date for receiving OHLC interval data: `To: '2019-05-03 10:24:53'` **/
    To: string;
}
