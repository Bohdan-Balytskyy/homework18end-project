import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServUsersService } from '../serv-users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  constructor(private router: Router, private servUser: ServUsersService) { }

  loginUser() {
    this.servUser.loginUser({
      email: this.email,
      password: this.password
    }).subscribe(
      () =>  this.router.navigate(['/main']),
      (err) =>console.log(err)
    )
  }
  ngOnInit(): void {
  }
}
