import { Component, OnInit } from '@angular/core';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  content: any;
  constructor(
    private restService: RestService, 
    public dataService: DataService,
    public domSanitizer: DomSanitizer) { }

  ngOnInit() {
    setTimeout(() => { this.dataService.loader = true;});
    const data = {
      'page_id': 'download',
      'lang': localStorage.getItem('lang')
    };
    this.restService.getPageContent(data).subscribe( (downloadContent: any) => {
        this.dataService.loader = false;
        console.log(downloadContent.data.content);
        this.content = this.domSanitizer.bypassSecurityTrustHtml(downloadContent.data.content); 
    })
  }

}
