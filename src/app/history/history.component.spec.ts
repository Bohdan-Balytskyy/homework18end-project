import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { HttpClientModule } from '@angular/common/http';
import { ServUsersService } from '../serv-users.service';
import { HistoryComponent } from './history.component';
import { Observable } from 'rxjs';


describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  const fakeServUsersService = jasmine.createSpyObj('fakeUserService',
    { ["getHistory"]: fakeReqvest$ },
    { ['userLogged']: { id: 2 } });
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryComponent],
    //   imports: [HttpClientTestingModule],
      providers: [{
        provide: ServUsersService, useValue: fakeServUsersService
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
