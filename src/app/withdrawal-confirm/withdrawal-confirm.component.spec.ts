import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalConfirmComponent } from './withdrawal-confirm.component';

describe('WithdrawalConfirmComponent', () => {
  let component: WithdrawalConfirmComponent;
  let fixture: ComponentFixture<WithdrawalConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
