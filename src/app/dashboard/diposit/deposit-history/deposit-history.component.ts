import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { RestService } from '../../../shared/services/rest.service';
import { TimetPipe } from '../../../shared/pipes/timet.pipe';
import { constants } from '../../../../constants';

@Component({
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.component.html',
  styleUrls: ['./deposit-history.component.css']
})
export class DepositHistoryComponent implements OnInit {

  rowData = [];
  public columnDefs;
  public searchValue;
  public gridApi;
  public gridColumnApi;

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
      { headerName: 'Status', field: 'status', 
          cellRenderer: function(params) {
            return constants.WITHDRAWAL_STATUS[params.value];
          }
      },
      { headerName: 'Tx Info', field: 'txinfo',
      cellRenderer: (params) =>{

        console.log('params value sis:',params.value);
        if(params.value !== null) {
          return '<a href="https://blockchain.info/tx/'+params.value+'" target="_blank">blockchain.info</a> ';
        }
      }}
    ];
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
          status: element.status,
          txinfo: element.txid,
          id: element.id
        };
        this.rowData.push(rowElement);
      });
    }
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
            'history_type': 'deposit'
    };
    this.restService.getWalletHistory(dataWallet).subscribe(orderHistory => {
      
      this.dataService.loader = false;
      this.createRowData(orderHistory);
      params.api.setRowData(this.rowData);
      params.api.sizeColumnsToFit();
    }, error => {
      console.log('Error gettting deposit history!');
    });

  }


}
