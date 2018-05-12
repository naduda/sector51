import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { ERole, IBox } from '../entities/common';
import { Profile } from '../entities/profile';
import { REST_API } from '../entities/rest-api';
import { CommonService } from '../services/common.service';

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
  public searchText: string;
  private boxes: IBox[];

  constructor(private http: HttpClient, private route: ActivatedRoute,
    public common: CommonService, private translate: TranslateService) {
    this.wWidth = window.innerWidth;
    this.isOwner = common.profile.role === ERole.OWNER;
  }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;

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
        this.sizeValue = spliter ? spliter.size : [25, 75];
      })
      .subscribe(users => {
        this.user = this.common.users.find(u => u['created'] === this.selectedUserId);
      });
  }

  get activeUsers(): Profile[] {
    return this.common.users.filter(u => u['active'] === true);
  }

  get users(): Profile[] {
    return this.common.users.filter(u => {
      if (!this.searchText) return true;
      return u.name.toUpperCase().includes(this.searchText.toUpperCase()) ||
        u.surname.toUpperCase().includes(this.searchText.toUpperCase()) ||
        u.card.includes(this.searchText) || u.phone.includes(this.searchText);
    });
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
}
