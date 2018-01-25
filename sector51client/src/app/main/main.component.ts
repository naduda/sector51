import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Profile } from '../entities/profile';
import { ModalComponent } from '../pages/modal/modal.component';
import { ModalService } from '../services/modal.service';
import { ERole, IBox } from '../entities/common';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { of } from 'rxjs/observable/of';
import { REST_API } from '../entities/rest-api';

@Component({
  selector: 'sector51-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public selectedUserId: number;
  public user: Profile;
  public showAll: boolean;
  public permissions: boolean;
  public wWidth: number;
  public sizeValue: number[];
  public letter: any;
  private boxes: IBox[];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private modalService: ModalService, public common: CommonService,
              private translate: TranslateService) {
    this.wWidth = window.innerWidth;
    this.letter = {
      'title': 'testTitle',
      'body': 'Test Message',
      'recipient': 'pavel.naduda@nik.net.ua'
    };
  }

  sendEmail() {
    this.http.post('/api/sendemail', this.letter).subscribe(result => console.log(result));
  }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;
    this.route.queryParams
    .do(params => {
      this.showAll = params['all'] === 'true';
      this.selectedUserId = params['user'] ? +params['user'] : +this.common.profile['created'];
    })
    .flatMap(params => this.http.get<IBox[]>(REST_API.GET.boxnumbers))
    .do(boxes => this.boxes = boxes)
    .flatMap(boxes => this.http.get<Profile[]>(REST_API.GET.users))
    .do(users => {
      this.common.users = [];
      users.forEach(u => {
        const exist = this.common.users.find(i => i['created'] === u['created']);
        const boxes = this.boxes.filter(b => b.card === u.card);
        if (boxes) {
          u['box'] = boxes.map(b => b.number).join('_');
          u['time'] = new Date(Math.max.apply(Math, boxes.map(b => +b.time)));
        }
        u['active'] = boxes.length > 0;
        if (!exist) this.common.users.push(u);
      });
      users.find(u => u['created'] === this.common.profile['created'])['active'] = true;
      const spliter = this.common.fromStorage('spliter');
      this.sizeValue = spliter ? spliter.size : [ 25, 75 ];
    })
    .subscribe(users => {
      this.user = users.find(u => u['created'] === this.selectedUserId);
      // if (!this.user['active']) {
      //   this.user = users.find(u => u['created'] === this.common.profile['created']);
      //   this.selectedUserId = this.user['created'];
      // }
    });
  }

  onDragEnd(columnindex: number, e: {gutterNum: number, sizes: Array<number>}) {
    this.common.toStorage('spliter', { size: e.sizes });
  }

  changeQueryParam(name: string, value: any) {
    this.route.queryParams.subscribe(params => {
      const newparams = {};
      Object.keys(params).forEach(key => newparams[key] = params[key]);
      newparams[name] = value;
      this.router.navigate(['/main'], { queryParams: newparams });
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
}
