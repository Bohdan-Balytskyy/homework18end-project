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
  saves: Save[];
  spends: Spend[];
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

  constructor(private servuser: ServUsersService, private router: Router) {
    this.userLogged = this.servuser.userLogged;
  }

  ngOnInit(): void {
  }
  logout() {
    this.servuser.token = '';
    this.servuser.userLogged = undefined;
    this.router.navigate(['/login']);
  }
  clickIncome() {
    this.isIncomeActive = !this.isIncomeActive;
    if (!this.isIncomeActive) {
      this.isDistributeActive = false;
      this.isIncomeAdd = false; 
    }
  }
  addIncomeStart() {
    this.isIncomeAdd = true;
  }
  addIncomeFinish(sum:number) {
    this.isIncomeAdd = false;
    this.isIncomeActive = false;
    let body = new FinancesClass(sum+this.userLogged.income,this.userLogged.saves,this.userLogged.spends)
    this.servuser.patchUser(this.userLogged.id, body).subscribe(
      () => this.userLogged = this.servuser.userLogged,
      (err) =>console.log(err)
    )
  }
  distribute() {
    this.isDistributeActive = true;
  }
  addSaveStart() {
    this.isAddSave = false;
  }
  addSaveFinish(title:string) {
    this.isAddSave = true;
    this.userLogged.saves.push({ name: title, icon: '', sum: 0, active:false}); //
    let body = new FinancesClass(this.userLogged.income,this.userLogged.saves,this.userLogged.spends)
    this.servuser.patchUser(this.userLogged.id, body).subscribe(
      () => this.userLogged = this.servuser.userLogged,
      (err) =>console.log(err)
    )
  }
  changeActiveSave(i: number) {
    this.userLogged.saves = this.userLogged.saves.map((save, ind) => {
      save.active = ind == i;
      return save;
    })
  }    
  activeSave($event, isSaveActive: boolean) {
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
      this.isCountIncome = true;
    }
  }
  addSpendStart() {
    this.isAddSpend = false;
  }
  addSpendFinish(title) {
    this.isAddSpend = true;
    this.userLogged.spends.push({ name: title,icon: '', sum: 0}); 
    let body = new FinancesClass(this.userLogged.income,this.userLogged.saves,this.userLogged.spends)
    this.servuser.patchUser(this.userLogged.id, body).subscribe(
      () => this.userLogged = this.servuser.userLogged,
      (err) =>console.log(err)
    )
  }
  
}
