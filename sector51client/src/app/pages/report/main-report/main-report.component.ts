import { Component, OnInit } from '@angular/core';
import { IHistory } from '../../../entities/common';
import { HttpClient } from '@angular/common/http';
import { REST_API } from '../../../entities/rest-api';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'sector51-main-report',
  templateUrl: './main-report.component.html',
  styleUrls: ['./main-report.component.css']
})
export class MainReportComponent implements OnInit {
  history: IHistory[];

  constructor(private http: HttpClient, private common: CommonService) {
    this.history = [];
  }

  ngOnInit() {
    this.http.get<IHistory[]>(REST_API.GET.history).subscribe(result => {
      result.forEach(h => {
        const user = h.idUser ? this.common.users.find(u => u['created'] === h.idUser) : undefined;
        const event = this.common.events.find(e => e.id === h.idEvent);
        h['event'] = event ? event.desc : '';
        h['user'] = user ? user.surname + ' ' + user.name : '';
        this.parseDescription(h);
        this.history.push(h);
      });
    });
  }

  private parseDescription(history: IHistory) {
    switch (history.idEvent) {
      case 2:
        const pars = history.desc.split('_');
        const service = this.common.services.find(s => s.id === +pars[0]);
        history.desc = service.name + ' (' + pars[1] + ')';
        break;
    }
  }
}
