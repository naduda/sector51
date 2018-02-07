import { Component, OnInit } from '@angular/core';
import { IModalWindow, ERestResult, IService, IResponse, IUserService } from '../../../entities/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../../../entities/profile';
import { REST_API } from '../../../entities/rest-api';
import { of } from 'rxjs/observable/of';
import { request } from 'http';
import { ModalComponent } from '../modal.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'sector51-abonement',
  templateUrl: './abonement.component.html',
  styleUrls: ['./abonement.component.css']
})
export class AbonementComponent implements OnInit, IModalWindow {
  dtBeg: Date;
  dtEnd: Date;
  cash: number;
  service: IService;
  idUser: number;
  isUpdate: boolean;
  private isRemove: boolean;
  private profile: Profile;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient,
              private modalService: ModalService) {
    this.cash = 0;
  }

  ngOnInit() {
    if (this.isUpdate) return;
    this.dtBeg = new Date();
    this.dtEnd = new Date();
  }

  private date2string(d: Date): string {
    let res = d.getFullYear() + '-';
    res += (d.getMonth() > 8 ? '' : '0') + (d.getMonth() + 1) + '-';
    res += d.getDate();
    return res;
  }

  btOkClick(instance: any, onSuccess) {
    const userService = {
      idService: instance.service.id,
      idUser: instance.idUser,
      dtBeg: instance.dtBeg,
      dtEnd: instance.dtEnd,
      desc: instance.cash
    };

    if (instance.isRemove) {
      const props = {
        header: 'attention',
        headerParam: { end: '!' },
        headerClass: 'alert alert-danger',
        body: 'prompt.RemoveItemQuestion',
        btOK: 'apply',
        btCancel: 'cancel'
      };
      instance.modalService.open(ModalComponent, props, (result) => {
        userService.idService = instance.service['idService'];
        instance.http.delete(REST_API.DELETE.userService(userService as IUserService))
          .subscribe((response: IResponse) => {
            if (ERestResult[ERestResult.OK] === response.result) {
              delete userService.dtBeg;
              onSuccess && onSuccess(userService);
            }
          });
      });
    } else if (instance.isUpdate) {
      userService.idService = instance.service['idService'];
      instance.http.put(REST_API.PUT.userService, userService)
        .subscribe((response: IResponse) => {
          if (ERestResult[ERestResult.OK] === response.result) {
            onSuccess && onSuccess(userService);
          }
        });
    } else {
      instance.http.post(REST_API.POST.userService, userService)
        .subscribe((response: IResponse) => {
          if (ERestResult[ERestResult.OK] === response.result) {
            onSuccess && onSuccess(userService);
          }
        });
    }
  }

  btCancelClick(reason: any, instance: any) { }

  init(props: any): void {
    this.service = props.service;
    this.idUser = props.idUser;
    this.cash = this.service.price || 0;
    this.isUpdate = props.isUpdate === true;
    if (this.isUpdate) {
      this.dtBeg = new Date(this.service['dtBeg']);
      this.dtEnd = new Date(this.service['dtEnd']);
      this.service.name = this.service['desc'];
    }
  }

  parseDate(dateString: string): Date {
    return dateString ? new Date(dateString) : null;
  }

  removeUserService() {
    this.isRemove = true;
    this.activeModal.close(true);
  }
}
