import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { ServUsersService } from '../serv-users.service';
import { MyprofileComponent } from './myprofile.component';
import { SumFormatPipe } from '../sum-format.pipe';
import { User } from '../interfaces/user';
import { UserPersonal } from '../interfaces/userPersonal';
import { ReactiveFormsModule } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

describe('MyprofileComponent', () => {
  let component: MyprofileComponent;
  let fixture: ComponentFixture<MyprofileComponent>;
  let pipeSpy: jasmine.Spy;
  let pipeSpy2: jasmine.Spy;
  const testUserFinances = {
    "income": 1000,
    "saves": [{ "name": "CASH", "icon": "fa fa-money", "sum": 500, "active": false }],
    "spends": [{ "name": "FOOD", "icon": "fa fa-coffee", "sum": 250 }],
  };
  let testUserPersonal: UserPersonal;
  let testUser: User;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  let fakeServUsersService: jasmine.Spy;
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync('Password#1', salt);
  
  beforeEach(async () => {    
    testUserPersonal = {
      "name": "Ivan",
      "surname": "Ivanenko",
      "email": "ivan@ivan.gmail.com",
      "password": password, 
      "image": "src\\app\\components\\uploads\\6.jpg",
      "link": "",
    }
    testUser = Object.assign(
      { "id": 2, "lastVisit": 1631566800000, "balance": 2000, "expenses": 1000 },
      testUserFinances, testUserPersonal) as User;
    fakeServUsersService = jasmine.createSpyObj('fakeUserService',
      { ["updateUser"]: fakeReqvest$ },
      { ['userLogged']: testUser});
    await TestBed.configureTestingModule({
      declarations: [MyprofileComponent,SumFormatPipe, DatePipe],
      imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule],
      providers: [{
        provide: ServUsersService, useValue: fakeServUsersService
      }]
    })
      .compileComponents();
    pipeSpy = spyOn(SumFormatPipe.prototype, 'transform');
    pipeSpy2 = spyOn(DatePipe.prototype, 'transform');
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('defineUrlAvatar if user.image should take part of string from userLogged.image for property url', () => {
    component.defineUrlAvatar(testUser);
    expect(component.url).toBe('http://localhost:5000/uploads/6.jpg');
  });
  it('defineUrlAvatar if !user.image should take defined path for property url', () => {
    let testUser2 = { ...testUser };
    testUser2.image = undefined;
    component.defineUrlAvatar(testUser2);
    expect(component.url).toBe('http://localhost:4200/assets/images/M.png');
  });
  it('defineUrlAvatar if user.link should take userLogged.link for property url', () => {
    let testUser3 = { ...testUser };
    testUser3.image = undefined;
    testUser3.link = 'http://localhost:4200/assets/images/5.jpg';
    testUser.link = testUser3.link;
    component.defineUrlAvatar(testUser3);
    expect(component.url).toBe('http://localhost:4200/assets/images/5.jpg');
  });
  it('handleFileInput should be called after clicking to save and read file', async () => {
    const event = spyOn(component, 'handleFileInput').and.callThrough();
    let button = fixture.debugElement.query(By.css('input[type="file"]'));
    event.calls.reset();
    const dT = new ClipboardEvent('').clipboardData || new DataTransfer()
    dT.items.add(new File(['foo'], 'test-file.jpg', { lastModified: null, type: 'image/jpeg' }))
    button.nativeElement.files = dT.files;
    let newEvent = new Event('change');
    await button.nativeElement.dispatchEvent(newEvent);
    // component.handleFileInput(newEvent); 
    expect(event).toHaveBeenCalled();
    expect(component.fileToUpload.name).toBe('test-file.jpg');
  });
  it('toBeginStage should change backgroundColor and set attribute readonly', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    const forTestTag = '<input type="text" id="test1" style="{backgroundColor: red;}">';
    form.insertAdjacentHTML('beforeend', forTestTag);
    const testTag = fixture.debugElement.query(By.css('#test1')).nativeElement;
    component.toBeginStage(testTag);
    expect(testTag.style.backgroundColor).toBe('white');
    expect(testTag.getAttribute('readonly')).toBeTruthy();
  })
  it('clearEditFields should call toBeginStage and clear field', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    const event = spyOn(component, 'toBeginStage');
    form.insertAdjacentHTML('beforeend', '<span id="test2"></span>');
    const testTag2 = fixture.debugElement.query(By.css('#test2')).nativeElement;
    component.activeEdit = testTag2;
    component.clearEditFields();
    expect(event).toHaveBeenCalled();
    expect(component.isChangePassword).toBeFalse();
    expect(component.isChangeCell).toBeFalse();
    expect(component.isCorrectOldPassword).toBeFalse();
    expect(component.activeEdit.style.display).toBe('none');
    expect(component.myForm.value.name).toBe(component.userLogged.name);
    expect(component.myForm.value.surname).toBe(component.userLogged.surname);
    expect(component.myForm.value.email).toBe(component.userLogged.email);
    expect(component.myForm.value.password1).toBe('');
    expect(component.myForm.value.password2).toBe('');
    expect(component.myForm.value.oldPassword).toBe('');
    component.activeEdit = undefined;
  })

  it('cancel should call clearEditFields and defineUrlAvatar and clear isShowPhoto and fileToUpload', () => {
    const event = spyOn(component, 'clearEditFields');
    const event2 = spyOn(component, 'defineUrlAvatar');
    component.cancel();
    expect(event).toHaveBeenCalled();
    expect(event2).toHaveBeenCalledWith(component.userLogged);
    expect(component.isShowPhoto).toBeFalse();
    expect(component.fileToUpload).toBeNull;
  })
  it('cancel should if userLogged.image should take part of string from userLogged.image for property url', () => {
    component.cancel();
    expect(component.url).toBe('http://localhost:5000/uploads/6.jpg');
  })
  it('cancel if user.link should take userLogged.link for property url', () => {
    let testUserlinkReal = testUser.link;
    let testUserImageReal = testUser.image;
    testUser.link = 'http://localhost:4200/assets/images/5.jpg';
    testUser.image = undefined;
    component.cancel()
    expect(component.url).toBe(component.userLogged.link);
    testUser.link = testUserlinkReal;
    testUser.image = testUserImageReal;
  })
  it('checkPassword should check password', async () => {
    bcrypt.compare('Password#1', component.userLogged.password, (err: Error, res: boolean) => {
      component.isCorrectOldPassword = res;
      expect(component.isCorrectOldPassword).toBeTruthy();
    });
    component.checkPassword('someString');
    expect(component.isCorrectOldPassword).toBeFalse();
    
  })
  it('showEdit should set activeEdit nextElementSibling and show it', async () => {
    const name = fixture.debugElement.query(By.css('#name')).nativeElement;
    const surname = fixture.debugElement.query(By.css('#surname')).nativeElement;
    component.activeEdit = name.nextElementSibling;
    name.nextElementSibling.style.display = 'inline-block';
    const newEvent = new Event('focus');
    await surname.dispatchEvent(newEvent);
    expect(name.nextElementSibling.style.display).toBe('none');
    expect(component.activeEdit).toEqual(surname.nextElementSibling);
    expect(surname.nextElementSibling.style.display).toBe('inline-block');
    component.cancel();
  })
  it('edit should set activeEdit and set isChangeCell true', async () => {
    const name = fixture.debugElement.query(By.css('#name')).nativeElement;
    const edit = name.nextElementSibling.firstElementChild;
    edit.click();
    expect(component.editElement).toEqual(name);
    expect(component.isChangeCell).toBeTruthy();
    component.editElement = undefined;
  })
  it('alowEdit should should be called after input ', () => {
    component.isChangeCell = true;
    fixture.detectChanges();
    const event = spyOn(component, 'alowEdit').and.callThrough();
    const passw = fixture.debugElement.query(By.css('#passw')).nativeElement;
    const name = fixture.debugElement.query(By.css('#name')).nativeElement;
    component.editElement = name;
    passw.value = 'Password#1';
    const newEvent = new Event('input');
    passw.dispatchEvent(newEvent);
    expect(event).toHaveBeenCalled();
    component.isChangeCell = false;
  })
  
  it('should call save after click', async () => {
    const event = spyOn(component, 'save');
    let button = fixture.debugElement.query(By.css('input[value="Save"]')).nativeElement;
    event.calls.reset();
    button.disabled = false;
    await button.click();    
    expect(event).toHaveBeenCalled();
  });
  it('save should сall clearEditFields', () => {
    const event = spyOn(component, 'clearEditFields');
    component.save();
    expect(event).toHaveBeenCalled();
  })
  it('choosePhoto should set properties url,fileToUpload,link and isShowPhoto', () => {
    component.isShowPhoto = true;
    fixture.detectChanges();
    const somePhoto = fixture.debugElement.query(By.css('.standartPhoto')).nativeElement.firstElementChild.firstElementChild;
    somePhoto.click();
    expect(component.url).toBe('http://localhost:9876/assets/images/M.png');
    expect(component.fileToUpload).toBe(null);
    expect(component.link).toBe('http://localhost:9876/assets/images/M.png');
    expect(component.isShowPhoto).toBeFalse();
    component.cancel();
  })
});
