import { Component, OnInit } from '@angular/core';
import { ServUsersService } from '../serv-users.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  constructor(private servuser: ServUsersService) {
    this.servuser.getStatistic(this.servuser.userLogged.id).subscribe(
      () => console.log(this.servuser.statistic),
      (err) =>console.log(err)
    )
  }

  ngOnInit(): void {
  }

}
