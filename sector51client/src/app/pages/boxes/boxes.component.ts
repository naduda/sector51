import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRole, IResponse, ERestResult, IBox } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { ModalService } from '../../services/modal.service';
import { BoxtypeComponent } from '../modal/boxtype/boxtype.component';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { CommonService } from '../../services/common.service';
import { ModalComponent } from '../modal/modal.component';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Profile } from '../../entities/profile';

@Component({
  selector: 'sector51-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.css']
})
export class BoxesComponent implements OnInit, OnDestroy {
  types: IRole[];
  type: IRole;
  boxNumbers: IBox[];
  boxes: IBox[];
  number: string;
  tooltip: string;
  private subscription: Subscription;
  private user: Profile;

  constructor(private http: HttpClient,
              private modalService: ModalService,
              private route: ActivatedRoute,
              private common: CommonService) {
    this.types = [];
    this.boxNumbers = [];
  }

  ngOnInit() {
    this.subscription = this.common.newBoxtype.subscribe(boxtype => {
      this.types.push(boxtype);
      if (this.type && this.type.name === 'new') this.type = this.types[0];
    });
    this.route.queryParams
    .flatMap(params => params.code ? this.http.get<Profile>(REST_API.GET.userByCard(params.code)) : of(new Profile()))
    .do(user => this.user = user)
    .flatMap(user => this.http.get<IRole[]>(REST_API.GET.boxtypes))
    .do(boxtypes => {
      this.types = boxtypes;
      if (!this.user.card) {
        this.type = boxtypes[0];
      } else {
        this.type = boxtypes.find(t => this.user['sex'] ? t.id === 1 : t.id === 2);
      }
      this.type = this.type || { id: -1, name: 'new' };
    })
    .flatMap(boxtypes => this.http.get<IBox[]>(REST_API.GET.boxnumbers))
    .subscribe(boxnumbers => {
      this.boxNumbers = boxnumbers;
      this.refreshBoxes();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private refreshBoxes() {
    this.boxes = this.boxNumbers.filter(b => b.idtype === this.type.id).map((b: IBox) => {
      b.time = b.card && b.time ? new Date(b.time) : undefined;
      if (b.time) {
        const user = this.common.users.find(u => +u['created'] === +b.card);
        b['tooltip'] = user.surname + ' ' + user.name + '\n';
        let month: string = b.time.getMonth().toString() + 1;
        month = +month < 10 ? '0' + month : month;
        b['tooltip'] += b.time.getDate() + '.' + month + '.' + b.time.getFullYear() + ' ';
        b['tooltip'] += b.time.getHours() + ':' + b.time.getMinutes();
      }
      return b;
    });
    this.boxes.sort((a, b) => a.number - b.number);
  }

  changeType(type: IRole) {
    this.type = type;
    this.refreshBoxes();
  }

  insertOrEditBoxType(insert: boolean) {
    this.modalService.open(BoxtypeComponent, { boxtype: insert ? undefined : this.type});
  }

  removeBoxType() {
    const props = {
      header: 'attention',
      headerParam: { end: '!' },
      headerClass: 'alert alert-danger',
      body: 'prompt.RemoveItemQuestion',
      btOK: 'apply',
      btCancel: 'cancel'
    };
    this.modalService.open(ModalComponent, props, (result) =>
      this.http.delete(REST_API.DELETE.boxtype(this.type.id)).subscribe((response: IResponse) => {
        if (response && response.result === ERestResult[ERestResult.OK].toString()) {
          this.types.splice(this.types.indexOf(this.type), 1);
          this.type = this.types.length > 0 ? this.types[0] : { id: -1, name: 'new' };
        } else {
          alert('Error');
        }
      })
    );
  }

  insertOrRemoveBoxNumber(insert: boolean) {
    const nums = this.number.split('-').map(s => Number(s));
    const min = Math.min.apply(Math, nums);
    const max = Math.max.apply(Math, nums);
    for (let i = min; i <= max; i++) {
      const httpAction: Observable<Object> = insert ?
        this.http.post(REST_API.POST.boxnumber, { idtype: this.type.id, number: i }) :
        this.http.delete(REST_API.DELETE.boxnumber(this.type.id, i));
      httpAction.subscribe((response: IResponse) => {
          if (response && response.result === ERestResult[ERestResult.OK].toString()) {
            if (insert) {
              this.boxNumbers.push({ idtype: this.type.id, number: +response.message });
            } else {
              const removed = response.message as IBox;
              const bNumber = this.boxNumbers.find(b => b.idtype === removed.idtype && b.number === removed.number);
              this.boxNumbers.splice(this.boxNumbers.indexOf(bNumber), 1);
            }
            this.refreshBoxes();
          } else {
            alert('Error');
          }
        });
    }
  }

  updateBox(box: IBox) {
    if (box.idtype === 3) return;
    const props = {
      header: this.user.surname + ' ' + this.user.name,
      headerParam: { end: '!' },
      headerClass: 'alert alert-info fa fa-key fa-2x',
      body: 'key',
      btOK: 'apply',
      btCancel: 'cancel'
    };
    this.modalService.open(ModalComponent, props, (result) => {
      const b = Object.assign({}, box);
      b.card = b.card ? undefined : this.user.card;
      this.http.put(REST_API.PUT.boxnumber, b)
        .subscribe((response: any) => {
          if (response && response.result === ERestResult[ERestResult.OK].toString()) {
            this.common.navigate('main', { user: this.user['created'] });
          }
        });
    });
  }
}
