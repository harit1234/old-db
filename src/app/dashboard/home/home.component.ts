import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';
import { MonetaryPipe } from '../../shared/pipes/monetary.pipe';
import { constants } from '../../../constants';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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
  public paginationPageSize = constants.PAGINATION_PAGE_SIZE;
  public balanceText: string;
  constructor(
    public dataService: DataService,
    private restService: RestService,
    private monentryPipe: MonetaryPipe,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.translateService.get('langDashboardTexts.lblBalances').subscribe(text => {
      this.balanceText = text;
    });
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('Lanugage Change Event', event.translations.langDashboardTexts.lblBalance);
        this.balanceText = event.translations.langDashboardTexts.lblBalance;
    });
    this.columnDefs = [
      { headerName: this.balanceText, field: 'balance' },
      { headerName: 'Open P/L', field: 'openpl' },
      { headerName: 'P/L', field: 'pl' },
      { headerName: 'Net Asset Value', field: 'netAssetValue' },
      { headerName: 'Used Margin', field: 'usedMargin' },
      { headerName: 'Available Margin', field: 'availMargin' }
    ];
  }

  /**
   * Creating the row data for balance
   * @param balanceInfo Any type
   */
  createRowData(balanceInfo: any) {
    console.log('Balace Info ', balanceInfo.account);
    if (balanceInfo.account) {
      if (balanceInfo.account instanceof Array) {

        balanceInfo.account.forEach(element => {
          const rowElement = {
            balance: this.monentryPipe.transform(balanceInfo.account.Balance, balanceInfo.account.Currency, 'value'),
            openpl: this.monentryPipe.transform(balanceInfo.account.UnrealizedPNL, balanceInfo.account.Currency, 'PnL'),
            pl: this.monentryPipe.transform(balanceInfo.account.RealizedPNL, balanceInfo.account.Currency, 'PnL'),
            netAssetValue: this.monentryPipe.transform(balanceInfo.account.NetAssetValue, balanceInfo.account.Currency, 'value'),
            usedMargin: this.monentryPipe.transform(balanceInfo.account.UsedMargin, balanceInfo.account.Currency, 'value'),
            availMargin: this.monentryPipe.transform(balanceInfo.account.UnusedMargin, balanceInfo.account.Currency, 'value')
          };
          this.rowData.push(rowElement);
        });
      } else {
        const rowElement = {
          balance: this.monentryPipe.transform(balanceInfo.account.Balance, balanceInfo.account.Currency, 'value'),
          openpl: this.monentryPipe.transform(balanceInfo.account.UnrealizedPNL, balanceInfo.account.Currency, 'PnL'),
          pl: this.monentryPipe.transform(balanceInfo.account.RealizedPNL, balanceInfo.account.Currency, 'PnL'),
          netAssetValue: this.monentryPipe.transform(balanceInfo.account.NetAssetValue, balanceInfo.account.Currency, 'value'),
          usedMargin: this.monentryPipe.transform(balanceInfo.account.UsedMargin, balanceInfo.account.Currency, 'value'),
          availMargin: this.monentryPipe.transform(balanceInfo.account.UnusedMargin, balanceInfo.account.Currency, 'value')
        };
        this.rowData.push(rowElement);
      }
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
    setTimeout(() => { this.dataService.loader = true; }, 0);
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
    const data = {
      'token_id': localStorage.getItem('sessionIdStorage'),
      'username': localStorage.getItem('userIdStorage')
    };
    this.restService.getAccountBalance(data).subscribe(balanceInfo => {
      console.log(balanceInfo);
      this.dataService.loader = false;
      this.createRowData(balanceInfo);
      params.api.setRowData(this.rowData);
    }, error => {
      console.log('Error gettting balance info');
    });
  }

  /**
   * When records on page changed
   * @param params value
   */
  onPageSizeChange(params) {
    console.log('Size Change', parseInt(params.target.value));
    this.gridApi.paginationSetPageSize(parseInt(params.target.value));
  }

}
