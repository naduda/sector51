import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IEvent } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public selectedEvents: IEvent[];

  constructor(public common: CommonService, private http: HttpClient) { }

  ngOnInit() {
    this.selectedEvents = this.common.events
      .filter(e => e.email ? e.email.includes(this.common.profile['created']) : false);
  }

  applyNotifications() {
    this.http.put(REST_API.PUT.events('email'), { ids: this.selectedEvents.map(e => e.id) })
      .subscribe(() => { });
  }
}
