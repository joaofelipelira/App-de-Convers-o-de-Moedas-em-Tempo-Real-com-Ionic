import { TestBed } from '@angular/core/testing';

import { OfflineDataService } from './offline-data.service';

describe('OfflineDataService', () => {
  let service: OfflineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
