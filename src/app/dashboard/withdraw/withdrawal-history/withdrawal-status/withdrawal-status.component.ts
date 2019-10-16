import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { constants } from '../../../../../constants';

@Component({
  selector: 'app-withdrawal-status',
  templateUrl: './withdrawal-status.component.html',
  styleUrls: ['./withdrawal-status.component.css']
})
export class WithdrawalStatusComponent implements ICellRendererAngularComp {

    public params: any;
    public withdrawalStatus:string;
    agInit(params: any): void {
        this.params = params;
        this.withdrawalStatus = constants.WITHDRAWAL_STATUS[params.value];
    } 

    public invokeParentMethod() {
        console.log('Value is : ', this.params.node.rowIndex, this.params.data.id);
        this.params.context.componentParent.cancelOrder(this.params.data.id);
    }

  refresh(): boolean {
    return false;
  }

}
