import { Component, OnInit } from '@angular/core';
import { History23task } from '../interfaces/history23task';
import { ServUsersService } from '../serv-users.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  yearsArray: number[] = [];
  firstYear: number;
  firstMonth: number;
  yearNow: number = new Date().getFullYear();
  monthNow: number = new Date().getMonth();
  activeMonthButton;
  activeYear: number;
  monthActive: number = this.monthNow;
  years: HTMLElement = document.getElementById('years');
  left: number;
  length: number;
  data = [];
  dataCosts: number | 'Нема даних';
  dataIncome: number | 'Нема даних';
  history23task: History23task[];
  history23taskFiltr: History23task[];
  
  
constructor(private servuser: ServUsersService) {
    
    this.servuser.getHistory(this.servuser.userLogged.id).subscribe(
      () => {
        this.history23task = this.servuser.history23task;
        this.firstYear = new Date(this.servuser.history[0].date).getFullYear();
        this.firstMonth = new Date(this.servuser.history[0].date).getMonth();
        this.activeMonthButton = document.getElementById(`${this.months[this.monthNow]}`);
        this.activeMonthButton.classList.add('active');

        for (let i: number = this.firstYear; i <= this.yearNow; i++){
          let dataOnMonthes = [];
          for(let k: number = 0; k <12; k++) {
            dataOnMonthes.push({year: i, month: k, income: undefined, costs: undefined}) 
          }
          this.yearsArray.push(i);
          this.data.push( ...dataOnMonthes );
        }
        
        this.years = document.getElementById('years');
        this.length = (this.yearsArray.length - 1) * 5;
        this.left = this.length;
        this.years.style.left = -this.left + 'rem';
        this.activeYear = this.yearsArray[this.yearsArray.length - 1];

        for (let j: number = 0; j < this.data.length; j++){
          let dateNumber = 0;
          for (let i: number = 0; i < this.servuser.history.length; i++){
            let year = new Date(this.servuser.history[i].date).getFullYear();
            let month = new Date(this.servuser.history[i].date).getMonth();
            let fullDate = this.servuser.history[i].date
            if (this.data[j].year === year && this.data[j].month === month &&
              fullDate > dateNumber) {
              dateNumber = this.servuser.history[i].date;
              this.data[j].costs = this.servuser.history[i].expenses;
              this.data[j].income = this.servuser.history[i].balance;
            }
          }
        }
        this.showData(this.yearNow, this.monthNow);
       },
      (err) =>console.log(err)
    )
  }

  ngOnInit(): void {
  }
  changeActiveButton($event) {
    if ($event.target.className.includes('month') && this.activeMonthButton !== $event.target) {
      if (this.activeMonthButton) this.activeMonthButton.classList.remove('active');
      this.activeMonthButton = $event.target;
      this.activeMonthButton.classList.add('active');
      this.monthActive = this.months.indexOf(this.activeMonthButton.value);
      this.showData(this.activeYear, this.monthActive);
    }
  }
  yearToLeft() {
    if (this.left <= 0) {
      this.left = 0;
    } else {
      this.left -= 5;
      this.activeYear = this.activeYear - 1;
      this.showData(this.activeYear, this.monthActive);
    }
    this.years.style.left = -this.left + 'rem';
  }
  yearToRight() {
    if (this.left >= this.length) {
      this.left = this.length;
    } else {
      this.left += 5;
      this.activeYear = this.activeYear + 1;
      this.showData(this.activeYear, this.monthActive);
    }
    this.years.style.left = -this.left + 'rem';
  }
  showData(year: number, month: number) {
    this.history23taskFiltr = this.history23task.filter((h) => {
      if (h.month === month && h.year === year) return h;
    })
    for (let i: number = 0; i < this.data.length; i++){
      if (this.data[i].year === year && this.data[i].month === month) {
        this.dataCosts = this.data[i].costs;
        this.data[i - 1].income ?
          this.dataIncome = this.data[i].income - this.data[i - 1].income + this.data[i].costs :
          this.dataIncome = this.data[i].income + this.data[i].costs;
      }
    }
    if ((year === this.firstYear && month < this.firstMonth) ||
      (year === this.yearNow && month > this.monthNow)) {
        this.dataCosts = 'Нема даних';
        this.dataIncome= 'Нема даних';
      }
  }
}
