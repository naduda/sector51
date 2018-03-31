import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Profile } from '../entities/profile';
import { ModalComponent } from '../pages/modal/modal.component';
import { ModalService } from '../services/modal.service';
import { ERole, IBox, ERestResult, IResponse, IEvent } from '../entities/common';
import { REST_API } from '../entities/rest-api';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'sector51-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public selectedUserId: number;
  public user: Profile;
  public permissions: boolean;
  public wWidth: number;
  public sizeValue: number[];
  public isOwner: boolean;
  public selectedEvents: IEvent[];
  private boxes: IBox[];

  constructor(private http: HttpClient, private route: ActivatedRoute,
              private modalService: ModalService, public common: CommonService,
              private translate: TranslateService) {
    this.wWidth = window.innerWidth;
    this.isOwner = common.profile.role === ERole.OWNER;
  }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;
    this.selectedEvents = this.common.events
      .filter(e => e.email ? e.email.includes(this.common.profile['created']) : false);

    this.route.queryParams
    .do(params => {
      this.selectedUserId = params['user'] ? +params['user'] : +this.common.profile['created'];
    })
    .flatMap(params => this.http.get<IBox[]>(REST_API.GET.boxnumbers))
    .do(boxes => {
      this.boxes = boxes.filter(b => b.idtype < 3);
      this.common.users.forEach(u => {
        const boxes = this.boxes.filter(b => b.card === u.card);
        if (boxes) {
          u['box'] = boxes.map(b => b.number).join(', ');
          u['time'] = new Date(Math.max.apply(Math, boxes.map(b => +b.time)));
          u['active'] = boxes.length > 0;
        }
      });
      const spliter = this.common.fromStorage('spliter');
      this.sizeValue = spliter ? spliter.size : [ 25, 75 ];
    })
    .subscribe(users => {
      this.user = this.common.users.find(u => u['created'] === this.selectedUserId);
    });
  }

  get activeUsers(): Profile[] {
    return this.common.users.filter(u => u['active'] === true);
  }

  onDragEnd(columnindex: number, e: { gutterNum: number, sizes: Array<number> }) {
    this.common.toStorage('spliter', { size: e.sizes });
  }

  changeQueryParam(name: string, value: any) {
    this.route.queryParams.subscribe(params => {
      const newparams = {};
      Object.keys(params).forEach(key => newparams[key] = params[key]);
      newparams[name] = value;
      this.common.navigate('main', newparams);
    }).unsubscribe();
  }

  removeUser(idUser) {
    const props = {
      header: 'attention',
      headerParam: { end: '!' },
      headerClass: 'alert alert-danger',
      body: 'prompt.RemoveUserQuestion',
      btOK: 'apply',
      btCancel: 'cancel'
    };
    this.modalService.open(ModalComponent, props, (result) =>
      this.http.delete(REST_API.DELETE.userById(idUser))
        .subscribe((response: any) => {
          if (response === 'OK') {
            this.common.users.splice(this.common.users.indexOf(this.user), 1);
            this.user = undefined;
          }
        })
    );
  }

  applyNotifications() {
    this.http.put(REST_API.PUT.events('email'), { ids: this.selectedEvents.map(e => e.id) })
      .subscribe((response: IResponse) => {
        if (ERestResult[ERestResult.OK] !== response.result) {
          alert('Something wrong...');
        }
      });
  }
}
