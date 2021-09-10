import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { ServUsersService } from '../serv-users.service';

import * as bcrypt from 'bcryptjs';
import { UserPersonal } from '../interfaces/userPersonal';

class UPClass implements UserPersonal {
  name: string;
  surname: string;
  password: string;
  email: string;
  image?: File;
  link?: string;
  constructor(name:string ,surname: string, password: string, email: string, image: File, link:string) {
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.email = email;
    this.image = image;
    this.link = link;
  }
}

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {

  userLogged: User;
  fileToUpload: File = null;
  link: string = '';
  myForm: FormGroup;
  isChangePassword:boolean = false;
  isCorrectOldPassword: boolean = false;
  isCorrectPassword: boolean = false;
  isChangeCell: boolean = false;
  activeEdit: HTMLElement;
  editElement: HTMLElement;
  url: string | ArrayBuffer;
  reader = new FileReader();
  isShowPhoto: boolean = false;
  @ViewChild("inputFile") inputFile;

  constructor(public servuser: ServUsersService, public router: Router) {
    this.userLogged = this.servuser.userLogged;
    this.reader.onload = ($event) => { 
      this.url = $event.target.result;
      this.link = '';       //!!!
    }
    this.defineUrlAvatar(this.userLogged);
    let lastVisit = new Date(this.userLogged.lastVisit) 
    this.myForm = new FormGroup({
      "email": new FormControl(this.userLogged.email, [Validators.required, Validators.pattern("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")]),
      "password1": new FormControl("", [Validators.required,
        Validators.pattern("(?=.*[0-9])(?=.*[!#$%^&\/])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!#$%^&\/]{8,}")]),
      "password2": new FormControl("", [Validators.required,
        Validators.pattern("(?=.*[0-9])(?=.*[!#$%^&\/])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!#$%^&\/]{8,}")]),
      "name": new FormControl(this.userLogged.name, [Validators.required, Validators.pattern("[a-zA-Z]+")]),
      "surname": new FormControl(this.userLogged.surname, [Validators.required, Validators.pattern("[a-zA-Z]+")]),
      "lastVisit": new FormControl(lastVisit),
      "balance": new FormControl(this.userLogged.balance),
      "oldPassword": new FormControl(""),
      "checkPassword": new FormControl(""),
    })
    
  }

  ngOnInit(): void {
  }

  defineUrlAvatar(user: User):void {
    user.image ?
      this.url = `http://localhost:5000/uploads/${this.userLogged.image.split("uploads\\")[1]}` :
      this.url = 'http://localhost:4200/assets/images/M.png';
    user.link ?
      this.url = this.userLogged.link : 'http://localhost:4200/assets/images/M.png';
  }

  handleFileInput($event):void {
    this.fileToUpload = $event.target.files.item(0);
    this.reader.readAsDataURL(this.fileToUpload);
  }
  toBeginStage(elem):void {
    elem.style.backgroundColor = 'white';
    elem.setAttribute('readonly', true);
  }
  clearEditFields():void {
    this.toBeginStage(document.getElementById('name'));
    this.toBeginStage(document.getElementById('surname'));
    this.toBeginStage(document.getElementById('email'));
    if (this.activeEdit) this.activeEdit.style.display = "none";
    this.isChangePassword = false;
    this.isChangeCell = false;
    this.isCorrectOldPassword = false;
    this.myForm.patchValue({
      name: this.userLogged.name,
      surname: this.userLogged.surname,
      email: this.userLogged.email,
      password1: '',
      password2: '',
      oldPassword: '',
    })
  }
  cancel(): void {
    this.myForm.patchValue({
      name: this.userLogged.name,
      surname: this.userLogged.surname,
      email: this.userLogged.email,
      password1: '',
      password2: '', 
    })
    this.clearEditFields();
    this.isShowPhoto = false;
    if (this.userLogged.link) this.url = this.userLogged.link;
    if (this.userLogged.image) this.url = `http://localhost:5000/uploads/${this.userLogged.image.split("uploads\\")[1]}`;
    this.defineUrlAvatar(this.userLogged);
    this.fileToUpload = null;
    this.link = '';
  }

  checkPassword(value: string):void {
    bcrypt.compare(value, this.userLogged.password,
      (err: Error, res: boolean) => this.isCorrectOldPassword = res);
  }
  showEdit($event):void {
    if ($event.target.className.includes('input')) {
      if (this.activeEdit) {
        this.activeEdit.style.display = "none";
      }
      this.activeEdit = $event.target.nextElementSibling;
      this.activeEdit.style.display = "inline-block";
    }
  }
  edit($event):void {
    this.editElement = $event.target.parentElement.previousElementSibling;
    this.isChangeCell = true;
  }
  alowEdit(value:string):void {
    bcrypt.compare(value, this.userLogged.password,
      (err: Error, res: boolean) => {
        this.isCorrectPassword = res;
        if (this.isCorrectPassword) {
          this.isChangeCell = false;
          this.myForm.patchValue({
            checkPassword: '',
          })
          this.editElement.removeAttribute('readonly');
          this.editElement.style.backgroundColor = 'lightgreen';
        }
      });
  }
  save(): void {
    let body = new UPClass(this.myForm.value.name, this.myForm.value.surname,
      this.myForm.value.password2, this.myForm.value.email, this.fileToUpload, this.link)
    this.servuser.updateUser(this.userLogged.id, body).subscribe(
      () => {
        this.userLogged = this.servuser.userLogged;
        this.clearEditFields();
      },
      (err) =>console.log(err)
    )
  }
  choosePhoto($event):void {
    if ($event.target.src) this.url = $event.target.src;
    this.fileToUpload = null;       //!!!
    this.link = $event.target.src;
    this.isShowPhoto = false;
  }
}
