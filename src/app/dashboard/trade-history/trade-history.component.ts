import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css']
})
export class TradeHistoryComponent implements OnInit {

  rowData = [];
  public columnDefs;
  public searchValue;
  public gridApi;
  public gridColumnApi;
  public paginationPageSize = 10;

  constructor(
    public dataService: DataService,
    private restService: RestService) { }

  ngOnInit() {

    this.columnDefs = [
      {headerName: 'Order ID', field: 'orderId', width: 180},
      {headerName: 'Time', field: 'time', width: 180},
      {headerName: 'Symbol', field: 'symbol', width: 180},
      {headerName: 'Side', field: 'side', width: 180},
      {headerName: 'Price', field: 'price', width: 180},
      {headerName: 'Qty', field: 'qty', width: 180}
    ];
  }

  createRowData(balanceInfo: any) {
    console.log(balanceInfo);
    if(balanceInfo.trade) {
      balanceInfo.trade.forEach(element => {
        var rowElement = {
          orderId: element.OrderID,
          time: element.InitTime,
          symbol: element.Symbol,
          side: element.OrderSide,
          price: element.Price,
          qty: element.Qty
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
    setTimeout(() => { this.dataService.loader = true;}, 0);
    const data = {
      'token_id': localStorage.getItem('token'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getTradeHistory(data).subscribe( tradeHistory => {
        console.log(tradeHistory);
        this.dataService.loader = false;
        this.createRowData(tradeHistory);
        params.api.setRowData(this.rowData);
    }, error => {
      console.log("Error gettting balance info+");
    });
  }
  onPageSizeChange(params) {
    console.log('Size Change',parseInt(params.target.value));
    this.gridApi.paginationSetPageSize(parseInt(params.target.value));
  }

}
