import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LacMatTelInputComponent } from './lac-mat-tel-input.component';

describe('LacMatTelInputComponent', () => {
  let component: LacMatTelInputComponent;
  let fixture: ComponentFixture<LacMatTelInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LacMatTelInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LacMatTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
