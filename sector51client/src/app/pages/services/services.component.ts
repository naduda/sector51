import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IService } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: IService[];

  constructor(public common: CommonService, private http: HttpClient) {
    this.services = [];
  }

  ngOnInit() {
    this.common.services.forEach(s => this.services.push(Object.assign({}, s)));
  }

  saveService(service: IService) {
    service['done'] = service['success'] = false;
    this.http.put(REST_API.PUT.service, service).subscribe(() => {
      service['success'] = true;
      const current = this.common.services.find(s => s.id === service.id);
      current.price = service.price;
    }, null, () => service['done'] = true);
  }
}
