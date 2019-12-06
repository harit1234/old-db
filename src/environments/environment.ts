// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'dev',
  restUrl: 'http://52.211.112.45/api/v1/',
  wssOMSURL: 'wss://staging-ws-order-v1.bitfex.com/',
  recaptchaKey: '6LdrWoIUAAAAAPHOs50VyHqS-RChEwgaSGlPI987',
  ipinfoAccessToken: "a4358b19f1bfdd",
  restrictedCountryCode: "US"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
