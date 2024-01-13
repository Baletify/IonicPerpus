import { TestBed } from '@angular/core/testing';

import { PerpusStorageService } from './perpus-storage.service';

describe('PerpusStorageService', () => {
  let service: PerpusStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerpusStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
