import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../shared/services/rest.service';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  activityLog: any = '';
  constructor(private restService: RestService, public dataService: DataService) { }

  ngOnInit() {
    setTimeout(() => this.dataService.loader = true);
    this.restService.getActivityLog().subscribe( activityLog => {
      this.dataService.loader = false;
      console.log("Activity Log is :::");
      console.log(activityLog);
      this.activityLog = activityLog;
    }); 
  }

}
