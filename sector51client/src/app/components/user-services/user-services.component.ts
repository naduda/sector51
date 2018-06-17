import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EConfirmType, ERole, IBox, IService, IUserService } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-user-services',
  templateUrl: './user-services.component.html',
  styleUrls: ['./user-services.component.css']
})
export class UserServicesComponent implements OnInit {
  @Input() set user(value: Profile) {
    if (!value) return;
    this._user = value;
    this.http.get<IUserService[]>(REST_API.GET.userServices(value['created'])).subscribe((response) => {
      this.userServices = response;
      this.modifyServices(this.userServices);
      const now = new Date();
      const isFinish = this.userServices.filter(us => us.dtEnd < now).length > 0;
      this.common.users.find(u => u['created'] === value['created'])['isFinish'] = isFinish;
    });
  }
  _user: Profile;
  trainers: Profile[];
  trainer: Profile;
  service: IService;
  userServices: IUserService[];
  userService: IUserService;
  allServices: IService[];
  dtBeg: Date;
  dtEnd: Date;
  cash: number;
  boxes: IBox[];
  boxNumber: IBox;

  constructor(private http: HttpClient, private common: CommonService) {
    this.service = { id: -1, name: '', desc: '', price: 0 };
  }

  ngOnInit() {
    this.trainers = this.common.users.filter(u => u['roles'] === ERole[ERole.TRAINER]);
    this.trainers.unshift(new Profile(null, 'Select trainer...', ''));
    this.trainers.forEach(trainer => trainer['fullName'] = (trainer.surname + ' ' + trainer.name).toUpperCase());
    this.http.get(REST_API.GET.boxnumbers).subscribe((boxes: IBox[]) => {
      this.boxes = boxes.filter(b => b.idtype === 3 && (!b.card || b.card.length === 0));
      if (this.boxes.length > 0) {
        this.boxes.sort((a, b) => a.number - b.number);
        this.boxNumber = this.boxes[0];
      }
    });
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
    const service = this.common.services.find(s => s.id === idService);
    this.addService(service, period);
  }

  addService(service?: IService, period?: number) {
    service = service || this.service;
    period = period || 1;

    this.dtBeg = new Date();
    this.dtEnd = new Date();
    if (this.dtEnd.getMonth() + period < 12) {
      this.dtEnd.setMonth(this.dtEnd.getMonth() + period);
    } else {
      this.dtEnd.setFullYear(this.dtEnd.getFullYear() + 1);
      this.dtEnd.setMonth(this.dtEnd.getMonth() + period - 12);
    }

    this.cash = service ? service.price : -1;
    const data: any = { dtBeg: this.dtBeg, dtEnd: this.dtEnd, cash: this.cash };
    if (service.id === 1) {
      data.trainers = this.trainers;
      data.trainer = this.trainer;
    }
    if (service.id === 2) {
      data.boxes = this.boxes;
      data.boxNumber = this.boxNumber;
    }
    this.common.confirm({
      type: service.id === 1 ? EConfirmType.TRAINER : service.id === 2 ? EConfirmType.BOX : EConfirmType.ABON,
      data: data,
      header: service ? service.name : '',
      accept: () => {
        const userService: any = {
          idService: service.id,
          idUser: this._user['created'],
          dtBeg: data.dtBeg,
          dtEnd: data.dtEnd,
          desc: data.cash
        };
        switch (userService.idService) {
          case 1:
            if (!data.trainer) {
              data.error = 'Select trainer.';
            } else {
              userService.value = data.trainer !== data.trainers[0] ? data.trainer['created'] : undefined;
            }
            break;
          case 2: userService.value = data.boxNumber.number; break;
        }
        if (data.error) {
          setTimeout(() =>
            this.common.confirm({
              type: EConfirmType.YES,
              message: data.error,
              accept: () => setTimeout(() => this.addService(service, period), 100)
            }), 100);
          return;
        }
        this.http.post(REST_API.POST.userService, userService).subscribe((inserted: IUserService) => {
          inserted.desc = service.name;
          this.userServices.push(inserted);
          this.service = { id: -1, name: '', desc: '', price: 0 };
          this.modifyServices(this.userServices);
          if (userService.idService === 2) {
            this.boxes.splice(this.boxes.indexOf(data.boxNumber), 1);
            this.boxes.sort((a, b) => a.number - b.number);
            this.boxNumber = this.boxes[0];
          }
        });
      }
    });
  }

  remove(uService: IUserService) {
    this.http.delete(REST_API.DELETE.userService(uService))
      .subscribe(() => {
        if (uService.idService === 2) {
          this.boxes.push({ idtype: 3, number: +uService.value });
          this.boxes.sort((a, b) => a.number - b.number);
          this.boxNumber = this.boxes[0];
        }
        this.userServices.splice(this.userServices.indexOf(uService), 1);
        this.service = { id: -1, name: '', desc: '', price: 0 };
        this.modifyServices(this.userServices);
      });
  }

  update(uService: IUserService) {
    uService['done'] = uService['success'] = false;
    this.http.put(REST_API.PUT.userService, uService)
      .subscribe(() => uService['success'] = true, null, () => uService['done'] = true);
  }
}
