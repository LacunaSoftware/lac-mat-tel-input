import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LacMatCountrySelectorComponent } from './lac-mat-country-selector.component';

describe('LacMatCountrySelectorComponent', () => {
  let component: LacMatCountrySelectorComponent;
  let fixture: ComponentFixture<LacMatCountrySelectorComponent>;

  beforeEach(async(() => {
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
