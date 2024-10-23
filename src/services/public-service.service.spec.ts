import { TestBed } from '@angular/core/testing';

import { PublicServiceService } from './public-service.service';

describe('PublicServiceService', () => {
  let service: PublicServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
