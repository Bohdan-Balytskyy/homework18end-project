import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { ServUsersService } from './serv-users.service';


describe('AuthGuard', () => {
  let guard: AuthGuard;
  let fakeServUsersService: jasmine.Spy;
  let routerStub;

  beforeEach(() => {
    fakeServUsersService = jasmine.createSpyObj('fakeUserService', {}, { ['userLogged']: undefined});
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    TestBed.configureTestingModule({
      providers: [{
        provide: ServUsersService, useValue: fakeServUsersService},
        { provide: Router, useValue: routerStub }]
    });
    guard = TestBed.inject(AuthGuard);
    
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  it('checkLogin should call router.navigate', () => {
    guard.checkLogin();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
  });
});
