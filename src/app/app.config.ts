import { environment } from '../environments/environment';
import { IAppConfig } from './models/app-config.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

  static settings: IAppConfig;

  constructor(private http: HttpClient) {
  }

  load() {
     console.log('AppConfig.load');
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get<IAppConfig>(jsonFile).toPromise().then((value: IAppConfig) => {
        AppConfig.settings = value;
        console.log(AppConfig.settings);
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
}
