import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../app/interfaces/user';
import { Finances } from '../app/interfaces/financesData';
import { History } from '../app/interfaces/history';
import { Statistic } from './interfaces/statistic';
import { UserPersonal } from './interfaces/userPersonal';


@Injectable({
  providedIn: 'root'
})
export class ServUsersService {
  
  public token: string = '';
  public userLogged: User | undefined;
  public history: History[];
  public statistic: Statistic[];
  public stream$ = new Subject<User>();


  constructor(private http: HttpClient) {
  }
  setHeaders(token) {
    let header = new HttpHeaders().set('Authorization', token);
    return {headers: header}
  }
  patchUser(id: number, body: Finances): Observable<User>{
    return this.http.patch<User>(`http://localhost:5000/users/` + id, body, this.setHeaders(this.token)).
      pipe(tap(data => {
        this.userLogged = data;
      }))
  }
  loginUser(body: { email: string, password: string }):
    Observable<{ access_token: string ,  user: User } >{
    return this.http.post<{ access_token: string, user: User }>
      (`http://localhost:5000/auth/sign-in`, body).
      pipe(tap(data => {
        this.token = data.access_token;
        this.userLogged = data.user;
      }))
  }
  getHistory(id: number): Observable<History[]>{
    return this.http.get<History[]>(`http://localhost:5000/users/history/` + id, this.setHeaders(this.token)).
      pipe(tap(data => {
        this.history = data;
      }))
  }
   getStatistic(id: number): Observable<Statistic[]>{
    return this.http.get<Statistic[]>(`http://localhost:5000/users/statistic/` + id, this.setHeaders(this.token)).
      pipe(tap(data => {
        this.statistic = data;
      }))
   }
  updateUser(id: number, body: UserPersonal): Observable<User>{
    let formData = new FormData();
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        formData.append(key, body[key]);
      }
    }
    return this.http.patch<User>(`http://localhost:5000/users/personal/` + id, formData, this.setHeaders(this.token)).
      pipe(tap(data => {
        this.userLogged = data;
        this.stream$.next(this.userLogged);
      }))
  }
}
