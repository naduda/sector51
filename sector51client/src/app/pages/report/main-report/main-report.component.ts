import { Component, OnInit } from '@angular/core';
import { IHistory, IProduct } from '../../../entities/common';
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
  selectedHistory: IHistory;
  products: IProduct[];

  constructor(private http: HttpClient,
              private common: CommonService) {
    this.history = [];
  }

  ngOnInit() {
    this.http.get<IProduct[]>(REST_API.GET.products)
    .do(products => this.products = products)
    .flatMap(products => this.http.get<IHistory[]>(REST_API.GET.history))
    .subscribe(result => {
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
    const pars = history.desc.split('_');
    switch (history.idEvent) {
      case 2:
        const service = this.common.services.find(s => s.id === +pars[0]);
        history.desc = service.name + ' (' + pars[1] + ')';
        break;
      case 4:
      case 5:
        const product = this.products.find(p => p.id === +pars[0]);
        history.desc = product.name + ' (' + pars[1] + ')';
        break;
    }
  }
}
