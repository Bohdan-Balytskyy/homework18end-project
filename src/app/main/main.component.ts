import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Save } from '../interfaces/save';
import { Spend } from '../interfaces/spend';
import { User } from '../interfaces/user';
import { Finances } from '../interfaces/financesData';
import { ServUsersService } from '../serv-users.service';

class FinancesClass implements Finances {
  income: number;
  saves: Save[];
  spends: Spend[];
  constructor(  income: number,saves: Save[],spends: Spend[]) {
    this.income = income;
    this.saves = saves;
    this.spends = spends;
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  userLogged: User
  isAddSave: boolean = true;
  isAddSpend: boolean = true;
  isIncomeActive: boolean = false;
  isIncomeAdd: boolean = false;
  isDistributeActive: boolean = false;
  isCountIncome: boolean = false;
  isCountSave: boolean = false;
  isSpendActive: boolean = false;
  isClue: boolean = false;
  today: Date = new Date;
  countInput: string = '';
  oldCountInput: string = '';
  equalOrEnter: boolean = false;
  possibleSign: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '/', '-', '+', '.'];
  lengthInput: number;
  saveIndex: number = null;
  spendIndex: number = null;
  isWarn: boolean = false;
  isWarn2: boolean = false;

  constructor(private servuser: ServUsersService, private router: Router) {
    this.userLogged = this.servuser.userLogged;
  }
  
  ngOnInit(): void {
  }
  logout(): void {
    this.servuser.token = '';
    this.servuser.userLogged = undefined;
    this.router.navigate(['/login']);

  }
  clickIncome(): void {
    this.isIncomeActive = !this.isIncomeActive;
    if (!this.isIncomeActive) {
      this.isDistributeActive = false;
      this.isIncomeAdd = false; 
    }
  }
  changeDataOnServer(): void {
    let body = new FinancesClass(this.userLogged.income,this.userLogged.saves,this.userLogged.spends)
    this.servuser.patchUser(this.userLogged.id, body).subscribe(
      () => this.userLogged = this.servuser.userLogged,
      (err) =>console.log(err)
    )
  }
  addIncomeFinish(sum:number): void {
    this.isIncomeAdd = false;
    this.isIncomeActive = false;
    this.userLogged.income += sum;
    this.changeDataOnServer();
  }
  addSaveFinish(title:string): void {
    this.isAddSave = true;
    this.userLogged.saves.push({ name: title, icon: '', sum: 0, active: false });
    this.changeDataOnServer();
  }
  changeActiveSave(i: number): void {
    this.userLogged.saves = this.userLogged.saves.map((save, ind) => {
      save.active = ind == i;
      return save;
    })
  }    
  activeSave($event, isSaveActive: boolean, i:number): void {
    if (!this.isIncomeActive) {
      if (isSaveActive) {
        this.changeActiveSave(100);
      } else {
        $event.target.classList.contains('center__circle') ?
          this.changeActiveSave(+$event.target.dataset.index) :
          this.changeActiveSave(+$event.target.parentElement.dataset.index);
      }
      this.isSpendActive = !this.isSpendActive || !isSaveActive;
    } else {
      if (this.isDistributeActive) {
        this.isCountIncome = true;
        this.saveIndex = i;  
      }
    }
  }
  addSpendFinish(title: string): void {
    this.isAddSpend = true;
    this.userLogged.spends.push({ name: title, icon: '', sum: 0 });
    this.changeDataOnServer();
  }
  checkOperand(str: string): void {
    this.equalOrEnter = str.includes('+') || str.includes('-') ||
      str.includes('*') || str.includes('/')
  }
  enterNumber($event): void {
    if ($event.target.className.includes('number') || (
      $event.target.className.includes('operand') && this.countInput !== '' && this.countInput[this.countInput.length - 1] !== '.' &&
      this.countInput[this.countInput.length - 1] !== '+' && this.countInput[this.countInput.length - 1] !== '-' &&
      this.countInput[this.countInput.length - 1] !== '/' && this.countInput[this.countInput.length - 1] !== '*')
    ) {
      this.countInput += $event.target.innerText;
    }
    this.checkOperand(this.countInput);
  }
  isEqualOperand(elem: string): boolean {
    return elem == '+' || elem == '-' || elem == '*' || elem == '/' || elem == '.';
  }
  checkInput($event): void {
    this.checkOperand(this.countInput); 
    if (this.isEqualOperand(this.countInput[0])) {
      this.countInput = this.countInput.slice(1);
    }
    if (this.isEqualOperand(this.countInput[this.countInput.length - 1]) &&
      this.isEqualOperand(this.countInput[this.countInput.length - 2])) {
      this.countInput = this.countInput.slice(0, -1);
    }
    if (this.countInput.length > this.lengthInput) {
      let count: number = 0;
      for (const sign of this.possibleSign) {
        if ($event.key === sign) count++
      }
      if (count == 0) {
        this.countInput = this.countInput.slice(0, -1);
        this.countInput = this.oldCountInput;
      }
    }
  }
  count(str): void {
    try {
      if (this.isEqualOperand(str[str.length - 1])) {
      str = str.slice(0, -1);
      }
      let countMultAndDiv = str.split('*').length + str.split('/').length - 2;
      for (let i = 0; i < countMultAndDiv; i++) {
        let reg = /(\d+(?:\.\d+)?)(\*|\/)(-?\d+(?:\.\d+)?)/;
        let operation = str.match(reg)[2];
        operation === '*' ? str = str.replace(reg, str.match(reg)[1] * str.match(reg)[3]) : str = str.replace(reg, str.match(reg)[1] / str.match(reg)[3]);
      }
      this.countInput = str;
      if (str.includes(Infinity)) {
        this.countInput = 'ділення на нуль';
        return;
      } else this.countInput = str;
      let countAddAndSub = str.split('+').length + str.split('-').length - 2;
      for (let i = 0; i < countAddAndSub; i++) {
        let reg = /(\d+(?:\.\d+)?)(\+|-)(-?\d+(?:\.\d+)?)/;
        let operation = str.match(reg)[2];
        operation === '+' ?
          str = str.replace(reg, Number(str.match(reg)[1]) + Number(str.match(reg)[3])) :
          str = str.replace(reg, str.match(reg)[1] - str.match(reg)[3]);
      }
      this.countInput = str;
    }
    catch {
      this.isWarn2 = true;
      setTimeout(()=>this.isWarn2 = false, 2000 )
    }
  }
  changeSum(value: string, isValid: boolean): void {
    if (isValid) {
      let number: number = +value;
      if (this.isCountIncome && this.userLogged.income >= number) {
        this.userLogged.income -= number;
        this.userLogged.saves[this.saveIndex].sum += number;
        this.isCountIncome = false;
      }
      if (this.isCountSave ) {
        for (const save of this.userLogged.saves) {
          if (save.active == true && save.sum >= number) {
            save.sum -= number;
            this.userLogged.spends[this.spendIndex].sum += number;
            this.isCountSave = false;
          }
        }
        this.changeActiveSave(100);
        this.isSpendActive = false;
      }
      this.changeDataOnServer();
    } else {
      this.isWarn = true;
      setTimeout(()=>this.isWarn = false, 2000 )
    }
  }
}
