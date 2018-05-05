import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ERestResult, ERole, IResponse, IService, IUserService } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { AbonementComponent } from '../../pages/modal/abonement/abonement.component';
import { CommonService } from '../../services/common.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'sector51-user-services',
  templateUrl: './user-services.component.html',
  styleUrls: ['./user-services.component.css'],
  providers: [ConfirmationService]
})
export class UserServicesComponent implements OnInit {
  @Input() set user(value: Profile) {
    if (!value) return;
    this._user = value;
    this.http.get<IResponse>(REST_API.GET.userServices(value['created'])).subscribe((response: IResponse) => {
      if (ERestResult[ERestResult.OK] === response.result) {
        this.userServices = response.message;
        this.modifyServices(this.userServices);
        const now = new Date();
        const isFinish = this.userServices.filter(us => us.dtEnd < now).length > 0;
        this.common.users.find(u => u['created'] === value['created'])['isFinish'] = isFinish;
      }
    });
  }
  _user: Profile;
  trainers: Profile[];
  service: IService;
  userServices: IUserService[];
  userService: IUserService;
  allServices: IService[];
  dtBeg: Date;
  dtEnd: Date;
  cash: number;

  constructor(private http: HttpClient, private common: CommonService,
    private modalService: ModalService, private confirmationService: ConfirmationService) {
    this.service = { id: -1, name: '', desc: '', price: 0 };
  }

  ngOnInit() {
    this.trainers = this.common.users.filter(u => u['roles'] === ERole[ERole.TRAINER]);
    this.trainers.unshift(new Profile(null, '-', ''));
  }

  private getAllServices() {
    const all = [];
    if (!this.userServices) return all;
    this.common.services.filter(s => s.id === 1 || s.id === 2).forEach(s => {
      if (!this.userServices.find(us => us.idService === s.id)) all.push(s);
    });
    if (this.service.id < 0 && this.userServices)
      this.service = all.length > 0 ? all[0] : undefined;
    return all;
  }

  get withAbon(): boolean {
    if (!this.userServices) return false;
    const abonIds = [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    for (const us of this.userServices) {
      if (abonIds.includes(us.idService)) return true;
    }
    return false;
  }

  private modifyServices(services: IUserService[]) {
    services.forEach(s => {
      s.dtBeg = new Date(s.dtBeg);
      s.dtEnd = new Date(s.dtEnd);
      switch (s.idService) {
        case 1:
          let trainerId = s.value && s.value.length > 0 ? +s.value : 0;
          if (s.value && !isNaN(+s.value)) trainerId = +s.value;
          const trainer = this.common.users.find(u => u['created'] === trainerId);
          s['valueDesc'] = trainer ? trainer.surname + ' ' + trainer.name : undefined;
          break;
        case 2:
          s['valueDesc'] = '№' + s.value;
          break;
        default: s['valueDesc'] = undefined;
      }
    });
    this.allServices = this.getAllServices();
  }

  changeTrainer(trainerIndex: number, service: IUserService) {
    const trainer = this.trainers[trainerIndex];
    service.value = trainer['created'];
    service['valueDesc'] = trainer ? trainer.surname + ' ' + trainer.name : undefined;
  }

  addAbonement(period: number, idService: number) {
    this.dtBeg = new Date();
    this.dtEnd = new Date();
    if (this.dtEnd.getMonth() + period < 12) {
      this.dtEnd.setMonth(this.dtEnd.getMonth() + period);
    } else {
      this.dtEnd.setFullYear(this.dtEnd.getFullYear() + 1);
      this.dtEnd.setMonth(this.dtEnd.getMonth() + period - 12);
    }
    const service = this.common.services.find(s => s.id === idService);
    this.cash = service ? service.price : -1;
    this.confirmationService.confirm({
      header: service ? service.name : '',
      message: null,
      accept: () => {
        const userService = {
          idService: idService,
          idUser: this._user['created'],
          dtBeg: this.dtBeg,
          dtEnd: this.dtEnd,
          desc: this.cash
        };
        this.http.post(REST_API.POST.userService, userService)
          .subscribe((response: IResponse) => {
            if (ERestResult[ERestResult.OK] === response.result) {
              const userService: IUserService = {
                idService: service.id,
                idUser: this._user['created'],
                dtBeg: this.dtBeg,
                dtEnd: this.dtEnd,
                desc: service.name,
                value: this.cash + ''
              };
              this.userServices.push(userService);
              this.service = { id: -1, name: '', desc: '', price: 0 };
              this.modifyServices(this.userServices);
            }
          });
      }
    });
  }

  addService() {
    this.modalService.open(AbonementComponent, {
      service: this.service, idUser: this._user['created']
    }, (userService: IUserService) => {
      userService.desc = this.common.services.find(s => s.id === userService.idService).name;
      this.userServices.push(userService);
      this.service = { id: -1, name: '', desc: '', price: 0 };
      this.modifyServices(this.userServices);
    });
  }

  remove(uService: IUserService) {
    this.http.delete(REST_API.DELETE.userService(uService))
      .subscribe((response: IResponse) => {
        if (ERestResult[ERestResult.OK] === response.result) {
          this.userServices.splice(this.userServices.indexOf(uService), 1);
          this.service = { id: -1, name: '', desc: '', price: 0 };
          this.modifyServices(this.userServices);
        }
      });
  }

  update(uService: IUserService) {
    uService['done'] = uService['success'] = false;
    this.http.put(REST_API.PUT.userService, uService)
      .subscribe((response: IResponse) => {
        uService['done'] = true;
        uService['success'] = ERestResult[ERestResult.OK] === response.result;
      });
  }
}
