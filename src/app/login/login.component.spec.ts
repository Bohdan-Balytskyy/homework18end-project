import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { ServUsersService } from '../serv-users.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  const fakeServUsersService = jasmine.createSpyObj('fakeUserService',
    { ["loginUser"]: fakeReqvest$ });
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule],
      providers: [
        { provide: ServUsersService, useValue: fakeServUsersService },
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loginUser after click', async () => {
    const event = spyOn(component, 'loginUser');
    let button = fixture.debugElement.query(By.css('input[type="button"]'));
    event.calls.reset();
    button.nativeElement.disabled = false;
    await button.nativeElement.click();    
    expect(event).toHaveBeenCalled();
  });
  it('loginUser should сall router.navigate', () => {
    component.loginUser();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/main']);
  })
});