import { TestBed } from '@angular/core/testing';

import { MainResolverService } from './main-resolver.service';

describe('MainResolverService', () => {
  let service: MainResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
