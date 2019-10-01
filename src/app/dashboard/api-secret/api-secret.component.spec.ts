import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSecretComponent } from './api-secret.component';

describe('ApiSecretComponent', () => {
  let component: ApiSecretComponent;
  let fixture: ComponentFixture<ApiSecretComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiSecretComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
