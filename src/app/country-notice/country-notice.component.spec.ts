import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryNoticeComponent } from './country-notice.component';

describe('CountryNoticeComponent', () => {
  let component: CountryNoticeComponent;
  let fixture: ComponentFixture<CountryNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
