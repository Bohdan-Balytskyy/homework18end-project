import { Component, OnInit } from '@angular/core';
import { ServUsersService } from '../serv-users.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private servuser: ServUsersService) {
    this.servuser.getHistory(this.servuser.userLogged.id).subscribe(
      () => console.log(this.servuser.history),
      (err) =>console.log(err)
    )
  }

  ngOnInit(): void {
  }

}
