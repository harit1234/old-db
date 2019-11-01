import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfxComponent } from './bfx.component';

describe('BfxComponent', () => {
  let component: BfxComponent;
  let fixture: ComponentFixture<BfxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
