import { Component, OnInit } from '@angular/core';
import { ServUsersService } from '../serv-users.service';
import {Chart, registerables} from 'node_modules/chart.js'

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  yearsArray: number[] = [];
  firstYear: number;
  firstMonth: number;
  yearNow: number = new Date().getFullYear();
  monthNow: number = new Date().getMonth();
  monthWork = this.monthNow;
  yearWork = this.yearNow;
  monthSelect: HTMLInputElement;
  yearSelect: HTMLInputElement;
  data = [];    //data with months and years
  dataFilter = {
    balance:undefined, expenses:undefined
  };
  myChart: Chart;
  whatShow: string = 'all';
  dataForTable = [];

  constructor(private servuser: ServUsersService) {
    this.servuser.getHistory(this.servuser.userLogged.id).subscribe(
      () => {
        this.firstYear = new Date(this.servuser.history[0].date).getFullYear();
        this.firstMonth = new Date(this.servuser.history[0].date).getMonth();
        let saves = this.servuser.history[this.servuser.history.length - 1].saves;
        let spends = this.servuser.history[this.servuser.history.length - 1].spends;
        for (let i: number = this.firstYear; i <= this.yearNow; i++){
          this.yearsArray.push(i);
          for (let k: number = 0; k < 12; k++) {
            this.data.push({ year: i, month: k})
          }
        }
        this.monthSelect = <HTMLInputElement>document.getElementById('month');
        this.yearSelect = <HTMLInputElement>document.getElementById('year');
        this.monthSelect.value = `${this.monthNow}`;
        setTimeout(() => this.yearSelect.value = `${this.yearNow}`, 0);
        
        for (let j: number = 0; j < this.data.length; j++){
          let dateNumber = 0;
          for (let i: number = 0; i < this.servuser.history.length; i++){
            let year = new Date(this.servuser.history[i].date).getFullYear();
            let month = new Date(this.servuser.history[i].date).getMonth();
            let fullDate = this.servuser.history[i].date
            if (this.data[j].year === year && this.data[j].month === month &&
              fullDate > dateNumber) {
              dateNumber = this.servuser.history[i].date;
              this.data[j].expenses = this.servuser.history[i].expenses;
              this.data[j].balance = this.servuser.history[i].balance;
              this.data[j].income = this.servuser.history[i].income;
              for (let t: number = 0; t < saves.length; t++){
                this.servuser.history[i].saves[t] ?
                  this.data[j]['save_' + saves[t].name] = this.servuser.history[i].saves[t].sum :
                  this.data[j]['save_' + saves[t].name] = 0;
              }
              for (let t: number = 0; t < spends.length; t++){
                this.servuser.history[i].spends[t] ?
                  this.data[j]['spend_' + spends[t].name] = this.servuser.history[i].spends[t].sum :
                  this.data[j]['spend_' + spends[t].name] = 0;
              }
            }
          }
        }
        this.showData();
      })
  }

  ngOnInit(): void {
  }

  changeYear(value: string) {
    this.yearWork = +value;
    this.showData();
  }
  changeMonth(value:string) {
    this.monthWork = +value;
    this.showData();
  }
  showData() {
    let profitPrevious: number;
    let profitNow: number;
    let balancePrevious: number;

    let font = {
      size: 15,
      family: "Times New Roman",
      weight: "bold"
    }
    let keys: string[];
    let labels: string[] = [];
    let dataForGraphic: number[] = [];
    let backgroundColor: string[] = [];
    let borderColor: string[] = [];

    for (let i: number = 0; i < this.data.length; i++){
      if (this.data[i].year === this.yearWork && this.data[i].month === this.monthWork) {
        this.dataFilter = { ...this.data[i] };
        this.data[i - 1].balance ?
          profitNow = this.data[i].balance - this.data[i - 1].balance + this.data[i].expenses :
          profitNow = this.data[i].balance + this.data[i].expenses;
        this.data[i - 2].balance ?
          profitPrevious = this.data[i-1].balance - this.data[i - 2].balance + this.data[i-1].expenses :
          profitPrevious = this.data[i - 1].balance + this.data[i - 2].expenses;
        balancePrevious = this.data[i - 1].balance;
        if (this.monthWork === this.firstMonth) {
          balancePrevious = 2000;
          profitPrevious = 3000;
        }
      }      
    }

    keys = Object.keys(this.dataFilter);
    if (this.whatShow === 'all' || this.whatShow === 'profit') {
      labels.push('Profit');
      dataForGraphic.push(profitNow / profitPrevious);  
    }
    if (this.whatShow === 'all' || this.whatShow === 'saves') {
      for (let i: number = 0; i < keys.length; i++){
        if (keys[i].includes('save')) {
          labels.push((keys[i]));
          dataForGraphic.push(this.dataFilter[keys[i]]/balancePrevious);
        }
      }
    }
    if (this.whatShow === 'all' || this.whatShow === 'costs') {
      labels.push('Expenses');    
      dataForGraphic.push(this.dataFilter.expenses / profitNow);
      for (let i: number = 0; i < keys.length; i++){
        if (keys[i].includes('spend')) {
          labels.push((keys[i]));
          dataForGraphic.push(this.dataFilter[keys[i]]/profitNow);
        }
      }
    }
    dataForGraphic = dataForGraphic.map((el) => Math.round(el * 100))
    for (let i: number = 0; i < dataForGraphic.length; i++){
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);
      backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
      borderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    Chart.register(...registerables);
    if (this.myChart) this.myChart.destroy();
    this.myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Статистика доходів і витрат',
          data: dataForGraphic,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          minBarLength: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              font: font
            },
            title: {
              display: true,
              text: 'Відсоток, %',
              font:font
            }
          },
          x: {
            ticks: {
              font: font
            }
          }
        },
        plugins: {
          legend: {
            labels: {
                // boxWidth:0,
                font: font,
                // color: 'green'
              }              
            }
        }
      }
    });

    this.dataForTable = [
      { category: 'Profit', interest: profitNow / profitPrevious , sum: profitNow  },
      { category: 'Expenses', interest: this.dataFilter.expenses / profitNow , sum: this.dataFilter.expenses }
    ];
    for (let i: number = 0; i < keys.length; i++){
      if (keys[i].includes('spend') || keys[i].includes('save')) {
        this.dataForTable.push({
          category: keys[i],
          interest: keys[i].includes('spend') ? this.dataFilter[keys[i]] / profitNow : this.dataFilter[keys[i]] / balancePrevious,
          sum: this.dataFilter[keys[i]] 
        });
      }
    }
    this.dataForTable = this.dataForTable.map((el) => {
      if (el.interest !== 0) el.interest = Math.round(el.interest * 100) || 'Немає даних';
      if (el.sum !== 0) el.sum = el.sum || 'Немає даних';
      return el;
    })
    this.dataForTable = this.dataForTable.sort((a, b) => b.sum-a.sum)
  }
}
