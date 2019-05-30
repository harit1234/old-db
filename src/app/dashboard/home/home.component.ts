import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


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
      { headerName: 'Balance', field: 'balance', width: 180 },
      { headerName: 'P/L', field: 'pl', width: 180 },
      { headerName: 'Open P/L', field: 'openpl', width: 180 },
      { headerName: 'Net Asset Value', field: 'netAssetValue', width: 180 },
      { headerName: 'Used Margin', field: 'usedMargin', width: 180 },
      { headerName: 'Available Margin', field: 'availMargin', width: 180 }
    ];

    console.log("HomeComponent: ngInit");
  }

  createRowData(balanceInfo: any) {
    console.log(balanceInfo);
    if (balanceInfo.account) {
      balanceInfo.account.forEach(element => {
        var rowElement = {
          balance: element.Balance,
          pl: '',
          openpl: '',
          netAssetValue: element.NetAssetValue,
          usedMargin: element.UsedMargin,
          availMargin: ''
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
    const data = {
      'token_id': localStorage.getItem('token'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getAccountBalance(data).subscribe(balanceInfo => {
      console.log(balanceInfo);
      this.dataService.loader = false;
      this.createRowData(balanceInfo);
      params.api.setRowData(this.rowData);
    }, error => {
      console.log("Error gettting balance info+");
    });
  }
  onPageSizeChange(params) {
    console.log('Size Change', parseInt(params.target.value));
    this.gridApi.paginationSetPageSize(parseInt(params.target.value));
  }

}
