import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class MainResolverService implements Resolve<User> {

  constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
    throw new Error('Method not implemented.');
  }
}
