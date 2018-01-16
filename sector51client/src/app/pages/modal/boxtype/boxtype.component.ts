import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IModalWindow, IRole, ERestResult } from '../../../entities/common';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { REST_API } from '../../../entities/rest-api';

@Component({
  selector: 'sector51-boxtype',
  templateUrl: './boxtype.component.html',
  styleUrls: ['./boxtype.component.css']
})
export class BoxtypeComponent implements OnInit, AfterViewInit, IModalWindow {
  header: string;
  type: IRole;
  focusPrice: any = {};
  private isInsert: boolean;
  private currentBoxType: IRole;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private common: CommonService) { }

  ngOnInit() {
    this.header = 'add';
    this.type = this.currentBoxType || { id: -1, name: '' };
  }

  ngAfterViewInit(): void {
    this.focusPrice.eventEmitter.emit(true);
  }

  btOkClick(instance: any) {
    if (instance.isInsert) {
      instance.http.post(REST_API.POST.boxtype, instance.type.name).subscribe(response => {
        instance.type.id = +response.message;
        instance.common.newBoxtype.next(instance.type);
      });
    } else {
      instance.http.put(REST_API.PUT.boxtype, instance.type).subscribe(response => {
        if (response && response.result === ERestResult[ERestResult.ERROR].toString()) {
          alert('Error: ' + response.message);
        }
      });
    }
    instance.activeModal.close(true);
  }

  btCancelClick(reason: any, instance: any) {}

  init(props: any): void {
    this.isInsert = props.boxtype === undefined;
    this.currentBoxType = props.boxtype;
  }
}
