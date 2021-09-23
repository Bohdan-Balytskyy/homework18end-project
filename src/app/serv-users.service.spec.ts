import { TestBed } from '@angular/core/testing';
import { ServUsersService } from './serv-users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from './interfaces/user';
import { Finances } from './interfaces/financesData';
import { UserPersonal } from './interfaces/userPersonal';
import {History} from './interfaces/history'
import { Statistic } from './interfaces/statistic';

describe('ServUsersService', () => {
  let service: ServUsersService;
  let http: HttpTestingController;
  let id: number;
  const testUserFinances = {
    "income": 1000,
    "saves": [
      { "name": "CASH", "icon": "fa fa-money", "sum": 500, "active": false },
      { "name": "BANK", "icon": "fa fa-bank", "sum": 500, "active": false }
    ],
    "spends": [
      { "name": "FOOD", "icon": "fa fa-coffee", "sum": 250 },
      { "name": "UTILITIES", "icon": "fa fa-home", "sum": 250 },
      { "name": "TRANSPORT", "icon": "fa fa-bus", "sum": 250 },
      { "name": "STUDY", "icon": "fa fa-graduation-cap", "sum": 250 }
    ],
  } as Finances;
  const testUserPersonal = {
    "name": "Ivan",
    "surname": "Ivanenko",
    "email": "ivan@ivan.gmail.com",
    "password": "$2a$10$Ywo2tM6ZdPb1OQhXd5AFL.H1yWv8jLMNIvwXVgHFoq.6jVmZ1OsIi",
    "image": "src\\app\\components\\uploads\\6.jpg",
    "link": "",
  } as UserPersonal;
  const testUser = Object.assign(
    { "id": 2, "lastVisit": 1631566800000, "balance": 2000, "expenses": 1000 },
    testUserFinances, testUserPersonal) as User;
  const testHistory = [Object.assign(
    { "date": 1631566800000, "balance": 2000, "expenses": 1000 },
    testUserFinances)] as History[];
  const testStatistic = [{"date": 1631566800000, "expenses": 1000, "spends": testUserFinances.spends}] as Statistic[]
  
  const expectedData = {access_token:'access_token', user: testUser};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServUsersService]
    });
    service = TestBed.inject(ServUsersService);
    http = TestBed.inject(HttpTestingController);
    id = 2;
  });
  
  afterEach(() => {
    http.verify();      //чи нема відкладених запитів
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('setHeaders should make header', () => {
    const token = "token";
    expect(service.setHeaders(token).headers.get('Authorization')).toBe("token");
  })
  it('loginUser should emits userData', () => {
    const data = { email: 'test@test.ua', password: 'testPassword' }
    service.loginUser(data).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });
    const reqLogin = http.expectOne(`http://localhost:5000/auth/sign-in`)
    reqLogin.flush(expectedData);
  });
  it('patchUser should emits userData', () => {
    const body = { ...testUserFinances };
    service.patchUser(id, body).subscribe((data) => {
      expect(data).toEqual(testUser);
    });
    const reqPatch = http.expectOne(`http://localhost:5000/users/` + id)
    reqPatch.flush(testUser);
  });
  it('updateUser should emits userData', () => {
    const body = { ...testUserPersonal };
    service.updateUser(id, body).subscribe((data) => {
      expect(data).toEqual(testUser);
    });
    const reqUpdate = http.expectOne(`http://localhost:5000/users/personal/` + id)
    reqUpdate.flush(testUser);
  });
  it('getHistory should emits historyData', () => {
    service.getHistory(id).subscribe((data) => {
      expect(data).toEqual(testHistory);
    });
    const reqHistory = http.expectOne(`http://localhost:5000/users/history/` + id)
    reqHistory.flush(testHistory);
  });
  it('getStatistic should emits statisticData', () => {
    service.getStatistic(id).subscribe((data) => {
      expect(data).toEqual(testStatistic);
    });
    const reqStatistic = http.expectOne(`http://localhost:5000/users/statistic/` + id)
    reqStatistic.flush(testStatistic);
  });

});

