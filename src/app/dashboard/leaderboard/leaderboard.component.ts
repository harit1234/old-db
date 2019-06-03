import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  rowData = [];
  public columnDefs;
  public searchValue;
  public gridApi;
  public gridColumnApi;
  public paginationPageSize = 100;

  constructor(
    public dataService: DataService,
    private restService: RestService
  ) { }

  ngOnInit() {
    setTimeout(() => { this.dataService.loader = true; });
    this.restService.getLeaderBoard().subscribe( leaderBoardInfo => {
      this.dataService.loader = false;
      console.log('Leaderboard Info: ', leaderBoardInfo);
    });

    this.columnDefs = [
      {headerName: '#', field: 'sno'},
      {headerName: 'Name/Email', field: 'name'},
      {headerName: 'Registered Referrals	', field: 'registered_ref'},
      {headerName: 'Total Referrals', field: 'total_ref'},
    ];

  }

  createRowData(leaderBoardInfo: any) {
    
    if(leaderBoardInfo.data.all) {
      leaderBoardInfo.data.all.forEach((element, index) => {

        var name = (element.name)?element.name:element.email;

        var rowElement = {
          sno: index + 1,
          name: name,
          registered_ref: element.registered_ref,
          total_ref: element.total_ref,
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
    this.restService.getLeaderBoard().subscribe( leaderBoardInfo => {
        console.log(leaderBoardInfo);
        this.dataService.loader = false;
        this.createRowData(leaderBoardInfo);
        params.api.setRowData(this.rowData);
    }, error => {
      console.log("Error gettting Leaderboard info+");
    });
  }

}
