import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { SlicePipe } from '@angular/common';
import { TimetPipe } from '../../shared/pipes/timet.pipe';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { constants } from '../../../constants';

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
  public paginationPageSize = constants.PAGINATION_PAGE_SIZE;

  constructor(
    public dataService: DataService,
    private restService: RestService,
    private slicePipe: SlicePipe,
    private timetPipe: TimetPipe,
    private pricePipe: PricePipe) { }

  ngOnInit() {

    this.columnDefs = [
      {headerName: 'Order ID', field: 'orderId'},
      {headerName: 'Time', field: 'time'},
      {headerName: 'Symbol', field: 'symbol'},
      {headerName: 'Side', field: 'side'},
      {headerName: 'Price', field: 'price'},
      {headerName: 'Qty', field: 'qty'}
    ];
  }

  createRowData(balanceInfo: any) {
    console.log(balanceInfo);
    if(balanceInfo.trade) {
      balanceInfo.trade.forEach(element => {
        var rowElement = {
          orderId: element.OrderID,
          time: this.timetPipe.transform(element.InitTime),
          symbol: element.Symbol,
          side: this.slicePipe.transform(element.OrderSide,3),
          price: this.pricePipe.transform(element.Price, this.dataService.instruments[element.Symbol]),
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

    params.api.sizeColumnsToFit();
    setTimeout(() => { this.dataService.loader = true;}, 0);
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };

    window.addEventListener("resize", function() {
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });
    
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
