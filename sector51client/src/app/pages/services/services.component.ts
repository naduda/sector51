import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { IService, IResponse, ERestResult } from '../../entities/common';
import { HttpClient } from '@angular/common/http';
import { REST_API } from '../../entities/rest-api';

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
    this.http.put(REST_API.PUT.service, service).subscribe((response: IResponse) => {
      service['done'] = true;
      service['success'] = ERestResult[ERestResult.OK] === response.result;
    });
  }
}
