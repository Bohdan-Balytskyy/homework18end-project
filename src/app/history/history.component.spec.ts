import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServUsersService } from '../serv-users.service';
import { HistoryComponent } from './history.component';
import { Observable } from 'rxjs';


describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  const fakeServUsersService = jasmine.createSpyObj('fakeUserService',
    { ["getHistory"]: fakeReqvest$ },
    { ['userLogged']: { id: 2 }, ['history23task']: [{ data: 1111 }], ['history']: [{ data: 1111 }] });
  const mockUpObject = {
  focus: () => null,
};
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
      declarations: [HistoryComponent],
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
