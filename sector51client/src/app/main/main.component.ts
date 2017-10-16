import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Profile } from '../entities/profile';
import { ModalComponent } from '../pages/modal/modal.component';
import { ModalService } from '../services/modal.service';
import { ERole } from '../entities/common';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sector51-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public selectedUserId: number;
  public user: Profile;
  public users: Profile[];
  public showAll: boolean;
  public permissions: boolean;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private modalService: ModalService, public common: CommonService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;
    this.route.queryParams
    .do(params => {
      this.showAll = params['all'] === 'true';
      this.selectedUserId = params['user'] ? +params['user'] : -1;
    })
    .flatMap(params => this.users ? Observable.of(this.users) : this.http.get<Profile[]>('/api/getUsers'))
    .do(users => this.users = users)
    .subscribe(users => this.user = users.find(u => u['created'] === this.selectedUserId));
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
      header: '',
      headerClass: 'alert alert-danger',
      body: 'promptRemoveUserQuestion',
      btOK: 'apply',
      btCancel: 'cancel'
    };
    this.translate.get('attention').subscribe(value => props.header = value + '!');
    this.modalService.open(props, (result) =>
      this.http.delete('/api/removeUser/' + idUser)
        .subscribe((response: any) => {
          if (response.result === 'OK') {
            this.users.splice(this.users.indexOf(this.user), 1);
            this.user = undefined;
          }
        })
    );
  }
}
