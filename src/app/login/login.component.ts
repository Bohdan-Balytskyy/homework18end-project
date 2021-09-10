import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServUsersService } from '../serv-users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup
  constructor(private router: Router, private servUser: ServUsersService) {
    this.myForm = new FormGroup({
    "userEmail": new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")]),
    "userPassword": new FormControl("", [Validators.required, Validators.pattern("(?=.*[0-9])(?=.*[!#$%^&\/])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!#$%^&\/]{8,}")]) 
    })
   }

  loginUser() {
    this.servUser.loginUser({
      email: this.myForm.controls.userEmail.value,
      password: this.myForm.controls.userPassword.value
    }).subscribe(
      () =>  this.router.navigate(['/main']),
      (err) =>console.log(err)
    )
  }
  ngOnInit(): void {
  }
}
