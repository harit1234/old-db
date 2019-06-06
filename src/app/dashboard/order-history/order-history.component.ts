import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import {QtyPipe} from '../../shared/pipes/qty.pipe';
import { TimetPipe } from '../../shared/pipes/timet.pipe';
import { SlicePipe } from '@angular/common';
import { constants } from '../../../constants';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  rowData = [];
  public columnDefs;
  public searchValue;
  public gridApi;
  public gridColumnApi;
  public paginationPageSize = constants.PAGINATION_PAGE_SIZE;

  constructor(
    public dataService: DataService,
    private restService: RestService,
    private pricePipe: PricePipe,
    private timetPipe: TimetPipe,
    private slicePipe: SlicePipe,
    private qtyPipe: QtyPipe) { }

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
    if(balanceInfo.order) {
      balanceInfo.order.forEach(element => {
        let price = '';
        if (element.Type == 'OT_Market' ) {
           price  = this.pricePipe.transform(element.LastPrice, this.dataService.instruments[element.Symbol]);
        }
        price =  this.pricePipe.transform(element.LimitPrice, this.dataService.instruments[element.Symbol]);

        
        var rowElement = {
          orderId: element.ID,
          time: this.timetPipe.transform(element.InitTime),
          symbol: element.Symbol,
          side: this.slicePipe.transform(element.OrderSide, 3),
          price: price,
          qty: this.qtyPipe.transform(element.OrigQty,  this.dataService.instruments[element.Symbol])
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

    window.addEventListener("resize", function() {
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });

    setTimeout(() => { this.dataService.loader = true;}, 0);
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getOrderHistory(data).subscribe( orderHistory => {
        console.log(orderHistory);
        this.dataService.loader = false;
        this.createRowData(orderHistory);
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
