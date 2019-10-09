/**
 * @module WebSocketAPI
 * @internal
 */

/**
 * IWebSocketWrapperParam
 *
 * Initialization example:
 *
 * ```TypeScript
 *     const options = {
 *         url: 'ws://url_to_server',
 *         username: 'user_name',
 *         session_id: 'session_id', // only for OMS connection
 *         options:{
 *             onclose: (ev) => {
 *                 // do something
 *             },
 *
 *             // provide function for handling Web-Socket messages
 *             onmessage: (ev) => console.log(ev)
 *         }
 *     }
 * ```
 *
 * @module WebSocketAPI
 * @internal
 *
 * *[OMS]: Order Management Service
 * *[MDS]: Market Data Service
 */
export interface IWebSocketAPIParam {
    /** URL to websocket server. For example: `ws://localhost:8090/` **/
    url: string;

    /** ATP Username **/
    username: string;
    /** sessionId is only user for Web-Socket OMS connection. Will be ignored for Web-Socket MDS connection. */
    sessionId?: string;
    options?: {
        /** An event listener to be called when the connection is opened. */
        onopen?: (ev: Event) => void,
        /** An event listener to be called when the connection is closed. */
        onclose?: (ev: CloseEvent) => void,
        /** An event listener to be called when a message is received from the server. */
        onmessage?: (ev: MessageEvent) => void,
        /** An event listener to be called when an error occurs. */
        onerror?: (ev: Event) => void
    };
}
