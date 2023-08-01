import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LacMatCountrySelectorComponent } from './lac-mat-country-selector.component';

describe('LacMatCountrySelectorComponent', () => {
  let component: LacMatCountrySelectorComponent;
  let fixture: ComponentFixture<LacMatCountrySelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LacMatCountrySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LacMatCountrySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
