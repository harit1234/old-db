import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { RestService } from '../../shared/services/rest.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  content:any;
  constructor(
    public dataService: DataService,
    private restService: RestService,
    private route: ActivatedRoute, private router: Router) { 
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    console.log("Query params");
    const pageName = this.route.snapshot.paramMap.get("page");
    if(pageName != '') {
        
        const data = {
          'page_id': pageName,
          'lang': localStorage.getItem('lang')
        };
        setTimeout(() => { this.dataService.loader = true; });
        this.restService.getPageContent(data).subscribe( (pageContent: any) => {
          this.dataService.loader = false;
            //console.log('Page content');
            //console.log(pageContent.data.content); 
            this.content = pageContent.data.content; 
        }

        );
    }

  }

}
