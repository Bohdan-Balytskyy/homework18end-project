import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServUsersService } from '../serv-users.service';
import { StatisticComponent } from './statistic.component';
import { Observable } from 'rxjs';


describe('StatisticComponent', () => {
  let component: StatisticComponent;
  let fixture: ComponentFixture<StatisticComponent>;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  const fakeServUsersService = jasmine.createSpyObj('fakeUserService',
    { ["getStatistic"]: fakeReqvest$ },
    { ['userLogged']: { id: 2 } });

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
