import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { EConfirmType, IBox, IRole, IUserService } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.css']
})
export class BoxesComponent implements OnInit {
  types: IRole[];
  type: IRole;
  boxNumbers: IBox[];
  boxes: IBox[];
  number: string;
  tooltip: string;
  private user: Profile;
  private userServices: IUserService[];

  constructor(private http: HttpClient, private route: ActivatedRoute, private common: CommonService) {
    this.types = [];
    this.boxNumbers = [];
  }

  ngOnInit() {
    this.route.queryParams
      .flatMap(params => params.code ? this.http.get<Profile>(REST_API.GET.userByCard(params.code)) : of(new Profile()))
      .do(user => this.user = user)
      .flatMap(() => this.http.get<IRole[]>(REST_API.GET.boxtypes))
      .do(boxtypes => {
        this.types = boxtypes;
        if (!this.user.card) {
          this.type = boxtypes[0];
        } else {
          this.type = boxtypes.find(t => this.user['sex'] ? t.id === 1 : t.id === 2);
        }
        this.type = this.type || { id: -1, name: 'new' };
      })
      .flatMap(() => this.http.get<IUserService[]>(REST_API.GET.userServices(this.user['created'])))
      .do(services => this.userServices = services)
      .flatMap(() => this.http.get<IBox[]>(REST_API.GET.boxnumbers))
      .subscribe(boxnumbers => {
        this.boxNumbers = boxnumbers;
        this.refreshBoxes();
      });
  }

  private refreshBoxes() {
    this.boxes = this.boxNumbers.filter(b => b.idtype === this.type.id).map((b: IBox) => {
      b.time = b.card && b.card.length > 10 && b.time ? new Date(b.time) : undefined;
      if (b.time) {
        const user = this.common.users.find(u => u.card === b.card);
        if (user) {
          b['tooltip'] = user.surname + ' ' + user.name + '\n';
          let month: string = (b.time.getMonth() + 1).toString();
          month = +month < 10 ? '0' + month : month;
          b['tooltip'] += b.time.getDate() + '.' + month + '.' + b.time.getFullYear() + ' ';
          b['tooltip'] += b.time.getHours() + ':' + b.time.getMinutes();
        } else {
          console.log(`User [${b.card}] does not exist`);
        }
      }
      return b;
    });
    this.boxes.sort((a, b) => a.number - b.number);
  }

  insertOrRemoveBoxNumber(insert: boolean) {
    const nums = this.number.split('-').map(s => Number(s));
    const min = Math.min.apply(Math, nums);
    const max = Math.max.apply(Math, nums);
    for (let i = min; i <= max; i++) {
      const httpAction: Observable<Object> = insert ?
        this.http.post(REST_API.POST.boxnumber, { idtype: this.type.id, number: i }) :
        this.http.delete(REST_API.DELETE.boxnumber(this.type.id, i));
      httpAction['value'] = i;
      httpAction.subscribe((response: any) => {
        if (insert) {
          this.boxNumbers.push({ idtype: this.type.id, number: response.number });
        } else {
          const bNumber = this.boxNumbers.find(b => b.idtype === this.type.id && b.number === httpAction['value']);
          this.boxNumbers.splice(this.boxNumbers.indexOf(bNumber), 1);
        }
        this.refreshBoxes();
      });
    }
  }

  updateBox(box: IBox) {
    if (box.idtype === 3) return;

    const twelve = this.userServices.find(s => s.idService === 14);

    this.common.confirm({
      type: EConfirmType.YES,
      header: this.user.surname + ' ' + this.user.name,
      icon: 'fa fa-key fa-2x',
      message: 'key',
      messageParam: { number: box.number },
      accept: () => {
        const b = Object.assign({}, box);
        b.card = b.card ? undefined : this.user.card;
        if (b.card && twelve) {
          twelve.value = (+twelve.value - 1) + '';
        }
        this.http.put(REST_API.PUT.boxnumber, b)
          .flatMap(() => twelve ? this.http.put(REST_API.PUT.userService, twelve) : of(''))
          .subscribe(() => this.common.navigate('main', { user: this.user['created'] }));
      }
    });
  }
}
