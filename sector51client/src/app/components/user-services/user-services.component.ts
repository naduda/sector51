import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../../entities/profile';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { IService, IUserService, IResponse, ERestResult } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { ModalService } from '../../services/modal.service';
import { AbonementComponent } from '../../pages/modal/abonement/abonement.component';

@Component({
  selector: 'sector51-user-services',
  templateUrl: './user-services.component.html',
  styleUrls: ['./user-services.component.css']
})
export class UserServicesComponent implements OnInit {
  @Input() set user(value: Profile) {
    this._user = value;
    this.http.get<IResponse>(REST_API.GET.userServices(value['created'])).subscribe((response: IResponse) => {
      if (ERestResult[ERestResult.OK] === response.result) {
        this.userServices = response.message;
        this.modifyService(this.userServices);
      }
    });
  }
  private _user: Profile;
  service: IService;
  userServices: IUserService[];
  userService: IUserService;

  constructor(private http: HttpClient, public common: CommonService,
    private modalService: ModalService) { }

  ngOnInit() {
    if (this.common.services && this.common.services.length > 0) this.service = Object.assign(this.common.services[0]);
  }

  private modifyService(services: IUserService[]) {
    services.forEach(s => {
      switch (s.idService) {
        case 1:
          const trainerId = s.value && s.value.length > 0 ? +s.value : 0;
          const trainer = this.common.users.find(u => u['created'] === trainerId);
          s['valueDesc'] = trainer ? trainer.surname + ' ' + trainer.name : undefined;
          break;
        default: s['valueDesc'] = undefined;
      }
    });
  }

  addService() {
    this.modalService.open(AbonementComponent, {
      service: this.service, idUser: this._user['created']
    }, (userService: IUserService) => {
      userService.desc = this.common.services.find(s => s.id === userService.idService).name;
      this.userServices.push(userService);
    });
  }

  editService(uService: IUserService) {
    this.modalService.open(AbonementComponent, {
      service: uService, idUser: this._user['created'], isUpdate: true
    }, (userService: IUserService) => {
      if (!userService.dtBeg) {
        const idx = this.userServices.indexOf(uService);
        this.userServices.splice(idx, 1);
      } else {
        this.userServices.forEach(us => {
          if (us.idService === userService.idService) {
            us.dtBeg = userService.dtBeg;
            us.dtEnd = userService.dtEnd;
            us.value = userService.value;
          }
        });
      }
    });
  }
}
