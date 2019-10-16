import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { RestService } from '../../../shared/services/rest.service';
import { TimetPipe } from '../../../shared/pipes/timet.pipe';
import { constants } from '../../../../constants';
import { WithdrawalStatusComponent } from './withdrawal-status/withdrawal-status.component';

@Component({
  selector: 'app-withdrawal-history',
  templateUrl: './withdrawal-history.component.html',
  styleUrls: ['./withdrawal-history.component.css']
})
export class WithdrawalHistoryComponent implements OnInit {

  rowData = [];
  public columnDefs;
  public searchValue;
  public gridApi;
  public gridColumnApi;

  public context;
  public frameworkComponents;
  public withdrawalError = '';
  public withdrawalSuccess = false;
  constructor(
    public dataService: DataService,
    private restService: RestService,
    private timetPipe: TimetPipe,
    ) { }

  ngOnInit() {
    console.log(constants.WITHDRAWAL_STATUS);
    this.columnDefs = [
      { headerName: 'Created', field: 'created_time'},
      { headerName: 'Modified', field: 'updated_time'},
      { headerName: 'Amount', field: 'amount', 
        cellRenderer: function(params) {
          return '<i class="fab fa-btc" aria-hidden="true"></i> '+params.value;
        }  
      },
      { headerName: 'Fee', field: 'fee', width: 100},
      { headerName: 'Address', field: 'address', width: 430},
      { headerName: 'Status', field: 'status', cellRendererFramework: WithdrawalStatusComponent},
      { headerName: 'Tx Info', field: 'txinfo', 
      cellRenderer: (params) =>{
        if(params.value !== null) {
          return '<a href="https://blockchain.info/tx/'+params.value+'" target="_blank">blockchain.info</a> ';
        }
      }}
    ];
    
    this.context = { componentParent: this };
    this.frameworkComponents = { WithdrawalStatusComponent: WithdrawalStatusComponent };
  }

  /**
   * This function is to cancel the withdrawal request
   * @param withdrawalId 
   */
  cancelOrder(withdrawalId:any) {
    this.withdrawalError = '';
    this.withdrawalSuccess = false;
    console.log('Cancel Order', withdrawalId);
    const data = { 'withdrawalId': withdrawalId };
    this.dataService.loader = true;
    this.restService.cancelWithdrawal(data).subscribe( (withdrawalStatus:any) => {
      this.dataService.loader = false;
      console.log('Withdrawal Status: ', withdrawalStatus.success);
      if(withdrawalStatus.success) {
         this.withdrawalSuccess = true;
      }
    }, error => {
      this.withdrawalError = error;
    });
  }

  /**
   * This functions creates the data row
   * @param withdrawalHistory 
   */
  createRowData(withdrawalHistory: any) {
    console.log('WithDrawal Data :', withdrawalHistory);
    if (withdrawalHistory) {
      withdrawalHistory.forEach(element => {
        const rowElement = {
          created_time: this.timetPipe.transform(element.created_time),
          updated_time: this.timetPipe.transform(element.updated_time),
          amount: parseFloat(Math.abs(element.amount).toString()).toFixed(8),
          fee: parseFloat(element.fee).toFixed(4),
          address: element.address,
          status: element.status,
          txinfo: element.txid,
          id: element.id
        };
        this.rowData.push(rowElement);
      });
    }
  }

  /**
   * Filtering the records
   */
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  /**
   * On ready action
   * @param params event
   */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    
    setTimeout(() => { this.dataService.loader = true; }, 0);
    const dataWallet = {
            'symbol': constants.DEFAULT_CURRENCY,
            'history_type': 'withdraw'
    };
    this.restService.getWalletHistory(dataWallet).subscribe(orderHistory => {
      console.log('Wallet history deposit data: ',orderHistory);
      this.dataService.loader = false;
      this.createRowData(orderHistory);
      params.api.setRowData(this.rowData);
     // params.api.sizeColumnsToFit();
    }, error => {
      console.log('Error gettting balance info+');
    });

  }
}
