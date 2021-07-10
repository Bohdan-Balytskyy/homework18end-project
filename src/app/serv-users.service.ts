import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../app/interfaces/user';
import { Finances } from '../app/interfaces/financesData';

@Injectable({
  providedIn: 'root'
})
export class ServUsersService {
  
  public token: string = '';
  public userLogged: User | undefined;
  
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
}
