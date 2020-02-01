import { TestBed } from '@angular/core/testing';

import { LacMatTelInputService } from './lac-mat-tel-input.service';

describe('LacMatTelInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LacMatTelInputService = TestBed.get(LacMatTelInputService);
    expect(service).toBeTruthy();
  });
});
