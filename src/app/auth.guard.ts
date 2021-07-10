import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
import { ServUsersService } from './serv-users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private servuser: ServUsersService, private router: Router) { }
  
  checkLogin(): boolean{
    if (this.servuser.userLogged !== undefined) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    // Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  boolean{
    return this.checkLogin();
  }
  
}
