import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServUsersService } from '../serv-users.service';
import { StatisticComponent } from './statistic.component';
import { Observable } from 'rxjs';


describe('StatisticComponent', () => {
  let component: StatisticComponent;
  let fixture: ComponentFixture<StatisticComponent>;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  const fakeServUsersService = jasmine.createSpyObj('fakeUserService',
    { ["getHistory"]: fakeReqvest$ },
    { ['userLogged']: { id: 2 }, ['history']: [{ data: 1111 }] });
  let HTMLElements = {};
  document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(ID) {
    if(!HTMLElements[ID]) {
        let newElement = document.createElement('div');
        HTMLElements[ID] = newElement;
    }
    return HTMLElements[ID];
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticComponent],
      providers: [{
        provide: ServUsersService, useValue: fakeServUsersService
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
