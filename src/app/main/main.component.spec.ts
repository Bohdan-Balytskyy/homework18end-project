import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';

import { MainComponent } from './main.component';
import { ServUsersService } from '../serv-users.service';
import { User } from '../interfaces/user';
import { UserPersonal } from '../interfaces/userPersonal';
import { Finances } from '../interfaces/financesData';
import { SumFormatPipe } from '../sum-format.pipe';
import { ActiveIconDirective } from '../active-icon.directive';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let testUserFinances: Finances;
  const testUserPersonal: UserPersonal = {
      "name": "Ivan",
      "surname": "Ivanenko",
      "email": "ivan@ivan.gmail.com",
      "password": '$2a$10$Ywo2tM6ZdPb1OQhXd5AFL.H1yWv8jLMNIvwXVgHFoq.6jVmZ1OsIi',
      "image": "src\\app\\components\\uploads\\6.jpg",
      "link": "",
    };
  let testUser: User;
  const fakeReqvest$ = new Observable(obs => { obs.next('someValue'); obs.error('someErr')});
  let fakeServUsersService: jasmine.Spy;
  let pipeSpy: jasmine.Spy;
  let pipeSpy2: jasmine.Spy;
  let routerStub;
  let stream$ = new Subject<User>();

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    testUserFinances = {
      "income": 1000,
      "saves": [{ "name": "CASH", "icon": "fa fa-money", "sum": 500, "active": false }],
      "spends": [{ "name": "FOOD", "icon": "fa fa-coffee", "sum": 250 }],
    };
    testUser = Object.assign(
      { "id": 2, "lastVisit": 1631566800000, "balance": 2000, "expenses": 1000 },
      testUserFinances, testUserPersonal) as User;
    fakeServUsersService = jasmine.createSpyObj('fakeUserService',
      { ["patchUser"]: fakeReqvest$ },
      { ['userLogged']: testUser, ['stream$']: stream$, ['token']: 'token' });
    await TestBed.configureTestingModule({
      declarations: [MainComponent,SumFormatPipe, DatePipe, ActiveIconDirective],
      imports: [RouterTestingModule.withRoutes([]), FormsModule],
      providers: [{
        provide: ServUsersService, useValue: fakeServUsersService},
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
    pipeSpy = spyOn(SumFormatPipe.prototype, 'transform');
    pipeSpy2 = spyOn(DatePipe.prototype, 'transform');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call logout after click', async () => {
    const event = spyOn(component, 'logout');
    let button = fixture.debugElement.query(By.css('.logout')).nativeElement;
    event.calls.reset();
    await button.click();    
    expect(event).toHaveBeenCalled();
  });
  it('logout should сall router.navigate', () => {
    component.logout();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('clickIncome should change isIncomeActive and if it is false change isDistributeActive and isIncomeAdd', () => {
    component.isIncomeActive = false;
    component.clickIncome();
    fixture.detectChanges();
    expect(component.isIncomeActive).toBeTruthy();
    expect(component.isDistributeActive).toBeFalse();
    expect(component.isIncomeAdd).toBeFalse();
    component.isIncomeActive = true;
    fixture.detectChanges();
    component.clickIncome();
    expect(component.isIncomeActive).toBeFalse();
  })
  it('addIncomeFinish should call changeDataOnServer', async () => {
    const event = spyOn(component, 'changeDataOnServer').and.callThrough();
    event.calls.reset();
    component.addIncomeFinish(100);
    expect(event).toHaveBeenCalled();
    expect(component.isIncomeActive).toBeFalse();
    expect(component.isIncomeAdd).toBeFalse();
    expect(component.userLogged.income).toBe(1100);
  });

  it('addSaveFinish should call changeDataOnServer and cnange isAddSave and userLogged.saves', () => {
    const event = spyOn(component, 'changeDataOnServer').and.callThrough();
    component.addSaveFinish('newSave')
    expect(event).toHaveBeenCalled();
    expect(component.isAddSave).toBeTruthy();
    expect(component.userLogged.saves[component.userLogged.saves.length-1].name).toBe('newSave');
  });
  
  it('changeActiveSave should set active save', () => {
    component.changeActiveSave(0);
    expect(component.userLogged.saves[0].active).toBeTruthy();
    component.changeActiveSave(100);
  });
  it('if isIncomeActive is false and isSaveActive is true, activeSave should call changeActiveSave(100)', () => {
    const event = spyOn(component, 'changeActiveSave');
    component.isCountIncome = false;
    component.activeSave('click', true, 0);
    expect(event).toHaveBeenCalledWith(100);
  });
  it('if isIncomeActive and isSaveActive are false, activeSave should call changeActiveSave with certain index', () => {
    const save = fixture.debugElement.query(By.css('div[data-index = "0"]')).nativeElement;
    const event = spyOn(component, 'changeActiveSave');
    component.isCountIncome = false;
    save.click();
    expect(event).toHaveBeenCalledWith(0);
    component.changeActiveSave(100);
    fixture.detectChanges();
    save.firstElementChild.click();
    expect(event).toHaveBeenCalledWith(0);
    component.changeActiveSave(100);
  });
  it('if isIncomeActive and isDistributeActive are true, activeSave should change isCountIncome and saveIndex', () => {
    component.isIncomeActive = true;
    component.isDistributeActive = true;
    fixture.detectChanges();
    component.activeSave('click', false, 0)
    expect(component.isCountIncome).toBeTruthy();
    expect(component.saveIndex).toBe(0);
    component.isCountIncome = false;
    component.isDistributeActive = false;
    component.isIncomeActive = false;
  });
  it('addSpendFinish should call changeDataOnServer and cnange isAddSpend and userLogged.spends', () => {
    const event = spyOn(component, 'changeDataOnServer').and.callThrough();
    component.addSpendFinish('newSpend')
    expect(event).toHaveBeenCalled();
    expect(component.isAddSpend).toBeTruthy();
    expect(component.userLogged.spends[component.userLogged.spends.length-1].name).toBe('newSpend');
  });
  it('checkOperand should set equalOrEnter', () => {
    component.checkOperand('5+8')
    expect(component.equalOrEnter).toBeTruthy();
    component.checkOperand('5693')
    expect(component.equalOrEnter).toBeFalse();
  });
  it('enterNumber should call checkOperand and set countInput', () => {
    const event = spyOn(component, 'checkOperand');
    component.isCountIncome = true;
    fixture.detectChanges();
    const number = fixture.debugElement.query(By.css('button.number')).nativeElement;
    number.click();
    expect(event).toHaveBeenCalled();
    expect(component.countInput).toContain('1');
    const symbol = fixture.debugElement.query(By.css('button.operand')).nativeElement;
    symbol.click();
    expect(component.countInput).toContain('1.');
    component.isCountIncome = false;
  });
  it('isEqualOperand should check is argument an operand', () => {
    expect(component.isEqualOperand('-')).toBeTruthy();
    expect(component.isEqualOperand('5')).toBeFalse();
  });
  it('checkInput should call checkOperand and clear first symbol if it is the operand and if two operand are in a row  delete one of them', () => {
    const event = spyOn(component, 'checkOperand');
    component.isCountIncome = true;
    fixture.detectChanges();
    const countInput = fixture.debugElement.query(By.css('.countInput')).nativeElement;
    component.countInput = '+';
    fixture.detectChanges();
    countInput.dispatchEvent(new KeyboardEvent('keyup'));
    expect(event).toHaveBeenCalled();
    expect(component.countInput).toBe('');
    component.countInput = '5++';
    fixture.detectChanges();
    countInput.dispatchEvent(new KeyboardEvent('keyup'));
    expect(component.countInput).toBe('5+');
    component.isCountIncome = false;
    component.countInput = '';
  });
  it('checkInput should delete symbol if it is not one of the possibleSign', () => {
    component.isCountIncome = true;
    fixture.detectChanges();
    const countInput = fixture.debugElement.query(By.css('.countInput')).nativeElement;
    component.countInput = '555';
    fixture.detectChanges();
    countInput.dispatchEvent(new KeyboardEvent('keydown'));
    component.countInput = '555a';
    fixture.detectChanges();
    countInput.dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
    expect(component.countInput).toBe('555');
    component.countInput = '';
    component.isCountIncome = false;
  });
  it('count should count correctly', fakeAsync(() => {
    component.count('30/10*4-6+4/');
    expect(component.countInput).toBe('10');
    component.count('10/0');
    expect(component.countInput).toBe('ділення на нуль');
    component.count('10/a');
    expect(component.isWarn2).toBeTruthy();
    tick(2001);
    expect(component.isWarn2).toBeFalse();
    component.countInput = '';
  }));
  it('changeSum if isValid and isCountIncome are true should transfer funds from income to save', () => {
    component.isCountIncome = true;
    component.saveIndex = 0;
    component.changeSum('100', true);
    expect(component.userLogged.income).toBe(900);
    expect(component.userLogged.saves[0].sum).toBe(600);
    expect(component.isCountIncome).toBeFalse();
    component.saveIndex = null;
  });
  it('changeSum if isValid and isCountSave are true should transfer funds from save to spend', () => {
    component.isCountSave = true;
    component.userLogged.saves[0].active = true;
    component.spendIndex = 0;
    component.changeSum('100', true);
    expect(component.userLogged.saves[0].sum).toBe(400);
    expect(component.isCountSave).toBeFalse();
    expect(component.userLogged.spends[0].sum).toBe(350);
    component.userLogged.saves[0].active = false;
    component.spendIndex = null;
  });
  it('changeSum if isValid is false should set isWarn true', fakeAsync(() => {
    component.changeSum('100', false);
    expect(component.isWarn).toBeTruthy();
    tick(2001);
    expect(component.isWarn).toBeFalse();
  }));
  it('should call animation after click', () => {
    const event = spyOn(component, 'animation');
    const menuSidebar = fixture.debugElement.query(By.css('.sidebar')).nativeElement;
    menuSidebar.click();
    expect(event).toHaveBeenCalled();
  });
  it('animation (open sidebar) should set isSideBar and style issidebar in 2 sec', fakeAsync( () => {
    const menuSidebar = fixture.debugElement.query(By.css('.sidebar')).nativeElement;
    menuSidebar.click();
    expect(component.isSideBar).toBeTruthy();
    tick(1);
    expect(component.sidebar.nativeElement.style.left).toBe('0px');
  }));
  it('animation (close sidebar click modal-block) should set isSideBar and style issidebar in 2 sec', fakeAsync( () => {
    const menuSidebar = fixture.debugElement.query(By.css('.modal-block')).nativeElement;
    component.sidebar.nativeElement.style.left = '0px';
    fixture.detectChanges();
    menuSidebar.click();
    expect(component.sidebar.nativeElement.style.left).toBe('-350px');
    tick(1001)
    expect(component.isSideBar).toBeFalse();
  }));
  it('animation (close sidebar click closeSideBar) should set isSideBar and style issidebar in 2 sec', fakeAsync( () => {
    const closeSideBar = fixture.debugElement.query(By.css('.closeSideBar')).nativeElement;
    component.sidebar.nativeElement.style.left = '0px';
    fixture.detectChanges();
    closeSideBar.click();
    expect(component.sidebar.nativeElement.style.left).toBe('-350px');
    tick(1001)
    expect(component.isSideBar).toBeFalse();
  }));
  it('animation (close sidebar click block__button) should set isSideBar and style issidebar in 2 sec', fakeAsync( () => {
    const buttonMenu = fixture.debugElement.query(By.css('.block__button')).nativeElement;
    component.sidebar.nativeElement.style.left = '0px';
    fixture.detectChanges();
    buttonMenu.click();
    expect(component.sidebar.nativeElement.style.left).toBe('-350px');
    tick(1001)
    expect(component.isSideBar).toBeFalse();
  }));
});
