import { Injectable, RootRenderer } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { constants } from '../../../constants';

@Injectable({
    providedIn: 'root'
})

export class TimerService {
    private checkApiStatusSub: Subscription;
    private checkApiStatusTimer;

    constructor() { }

    public startCheckApiStatusTimer(cb) {
        if (this.checkApiStatusSub != null) {
            this.checkApiStatusSub.unsubscribe();
        }
        console.log("Timer is", constants.CHECK_API_STATUS_DEALAY);
        this.checkApiStatusTimer = timer(1000, constants.CHECK_API_STATUS_DEALAY);
        this.checkApiStatusSub = this.checkApiStatusTimer.subscribe(val => {
            console.log('checkCardTimer');
            console.log(val);
            cb(val);
        });
    }
    public stopCheckApiStatusTimer() {
        if (this.checkApiStatusSub != null) {
            this.checkApiStatusSub.unsubscribe();
            this.checkApiStatusTimer = null;
        }
    }
}
