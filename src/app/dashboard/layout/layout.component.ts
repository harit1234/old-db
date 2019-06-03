import { Component, OnInit, HostListener } from '@angular/core';
import { RestService } from '../../shared/services/rest.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  hamburgerMenuStatus = false;
  constructor(private restService: RestService, public dataService: DataService) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 70) {
      const element = document.getElementById('header');
      const element1 = document.body;
      element.classList.add('sticky-header');
      element1.classList.add('body-sticky-header');
    } else {
      const element = document.getElementById('header');
      element.classList.remove('sticky-header');
      const element1 = document.body;
      element1.classList.remove('body-sticky-header');
    }
  }
  ngOnInit() {
    this.dataService.getInstrument();
  }

  onOpened(status: boolean) {
    this.hamburgerMenuStatus = status;
  }

}
