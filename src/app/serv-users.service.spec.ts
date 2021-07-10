import { TestBed } from '@angular/core/testing';

import { ServUsersService } from './serv-users.service';

describe('ServUsersService', () => {
  let service: ServUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
