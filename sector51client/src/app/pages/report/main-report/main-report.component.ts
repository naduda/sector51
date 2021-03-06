import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IHistory, IProduct, ITableExport } from '../../../entities/common';
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
  events: any[];
  selectedEvents: number[];
  dtBeg: Date;
  dtEnd: Date;
  icon: string;
  tableColumns: ITableExport[];

  constructor(private http: HttpClient, private common: CommonService) {
    this.history = [];
    this.selectedEvents = [2, 5];
    this.events = this.common.events.map(function (e) { return { label: e.desc, value: e.id }; });
    this.dtEnd = new Date();
    this.dtBeg = new Date(this.dtEnd.getFullYear(), this.dtEnd.getMonth(), this.dtEnd.getDate());
    this.dtEnd = new Date(this.dtBeg.getTime() + 24 * 60 * 60 * 1000);
    this.icon = 'fa-calendar-check-o';
    this.tableColumns = [
      { field: 'formatTime', header: 'time' },
      { field: 'event', header: 'name' },
      { field: 'user', header: 'object' },
      { field: 'desc', header: 'desc' },
      { field: 'income', header: 'income' },
      { field: 'outcome', header: 'outcome' },
      { field: 'usercome', header: 'usercome' }
    ];
  }

  ngOnInit() {
    this.http.get<IProduct[]>(REST_API.GET.products)
      .do(products => this.products = products)
      .subscribe(products => this.changeDate(null));
  }

  changeDate(date: Date) {
    this.history = [];
    this.http.get<IHistory[]>(REST_API.GET.history(this.dtBeg, this.dtEnd))
      .subscribe(result => {
        result.forEach(h => {
          const user = h.idUser ? this.common.users.find(u => u['created'] === h.idUser) : undefined;
          const event = this.common.events.find(e => e.id === h.idEvent);
          h['event'] = event ? event.desc : '';
          h['user'] = user ? user.surname + ' ' + user.name : '';
          h['formatTime'] = this.formatDateTime(h.time);
          this.history.push(h);
        });
      });
  }

  private formatDateTime(value: number): string {
    const date = new Date(value);
    return date.getDate() + '.' + this.formatNumber(date.getMonth() + 1) + '.' + date.getFullYear() + ' ' +
      this.formatNumber(date.getHours()) + ':' + this.formatNumber(date.getMinutes()) + ':' +
      this.formatNumber(date.getSeconds());
  }

  private formatNumber = (value: number): string => value < 10 ? '0' + value : value.toString();
}
