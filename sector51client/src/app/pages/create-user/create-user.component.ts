import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms/src/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  ERestResult,
  ERole,
  ESex,
  IResponse,
  IRole,
  IService,
  IUserService
  } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';
import { ModalService } from '../../services/modal.service';
import { AbonementComponent } from '../modal/abonement/abonement.component';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  @Input() set profile(value) {
    if (!value) {
      return;
    }
    this.user = value;
    if (this.user.birthday) this.user.birthday = new Date(this.user.birthday);
    this.user.sex = this.user['sex'] ? ESex.MAN : ESex.WOMAN;
    this.user.authorities = this.user['roles'];
    this.usersNotExist = false;
    this.buttonText = this.user.name ? 'update' : 'create';
    this.user['password'] = this.user['password2'] = '';
    this.isBack = false;
    this.selectedGender = this.genders.find(g => g.value === this.user.sex);
    this.selectedAuthority = this.allRoles.find(r => this.user.authorities.includes(r.name));
  }
  allRoles: IRole[];
  created: boolean;
  user: Profile;
  cardRedonly: boolean;
  usersNotExist: boolean;
  buttonText: string;
  isFirst: boolean;
  genders: any[];
  selectedGender: any;
  selectedAuthority: any;
  private idUser: number;
  private isBack = true;

  constructor(private http: HttpClient, private location: Location,
    private route: ActivatedRoute, public common: CommonService,
    private modalService: ModalService) {
    this.buttonText = 'create';
    this.allRoles = this.common.profile ? this.common.profile['iroles'] : null;
    this.genders = [
      { name: ESex[ESex.MAN], value: ESex.MAN },
      { name: ESex[ESex.WOMAN], value: ESex.WOMAN }
    ];
    this.selectedGender = this.genders[0];
    this.selectedAuthority = this.allRoles.find(r => r.name === ERole[ERole.USER]);
  }

  ngOnInit() {
    if (this.user) return;
    let code;
    this.route.params
      .do(params => this.idUser = params['idUser'] || -1)
      .flatMap(params => this.route.queryParams)
      .do(params => this.isFirst = params['first'] || false)
      .do(queryParams => code = queryParams['code'] || '')
      .flatMap(params => this.http.get<boolean>(REST_API.GET.usersNotExist))
      .do(usersNotExist => this.usersNotExist = usersNotExist)
      .flatMap(usersNotExist => usersNotExist ?
        of(null) : this.http.get<Profile>(REST_API.GET.userById(this.idUser)).catch(e => of(null)))
      .do((user: Profile) => {
        if (!user) {
          user = new Profile();
          user.sex = ESex.MAN;
          this.created = true;
        } else {
          user.email = user.email.toLowerCase();
          user.authorities = user['roles'];
        }
        user.sex = user['sex'] ? ESex.MAN : ESex.WOMAN;
        user.card = code || user.card;
        this.cardRedonly = code;
        this.user = user;
        if (this.user.birthday) this.user.birthday = new Date(this.user.birthday);
      })
      .flatMap(user => this.allRoles === null ? this.http.get<any[]>(REST_API.GET.roles) : of(this.allRoles))
      .do(pairs => {
        if (this.allRoles === null) {
          this.user.authorities = ERole[ERole.OWNER];
          this.allRoles = pairs.map(pair => ({
            id: +pair['key'],
            name: pair['value']
          })).filter(p => p['value'] === this.user.authorities);
        }
        this.allRoles = this.allRoles.filter(r => r.id >= this.common.profile.role);
      })
      .subscribe(users => {
        this.buttonText = this.user.name ? 'update' : 'create';
        this.user['password'] = this.user['password2'] = '';
      });
  }

  get isEmailRequired(): boolean {
    const role = this.user.authorities;
    return role.includes(ERole[ERole.OWNER]) || role.includes(ERole[ERole.ADMIN]);
  }

  get isNotTrainerOrSelder() {
    return this.user.authorities !== ERole[ERole.TRAINER] &&
      this.user.authorities !== ERole[ERole.SELDER];
  }

  get showPassword() {
    const auth = this.user.authorities;
    return auth === ERole[ERole.OWNER] || auth === ERole[ERole.ADMIN];
  }

  changePassword(value: string, isRepeat: boolean) {
    this.user[isRepeat ? 'password2' : 'password'] = value;
  }

  validate(psw2: NgModel) {
    if (this.user['password'] !== this.user['password2']) {
      psw2.control.setValue(this.created ? '' : this.user['password']);
    }
    return (this.user['password'] === this.user['password2'] || !this.created) && this.user.authorities.length > 0;
  }

  onSubmit() {
    this.user['roles'] = this.user.authorities;
    if (this.user['password'] !== undefined && this.user['password'].length === 0) {
      delete this.user['password'];
    }

    if (this.idUser < 0 && this.usersNotExist) {
      this.http.post(REST_API.POST.firstUser, this.user)
        .subscribe(result => this.onResult(result));
    } else if (this.idUser < 0 && !this.usersNotExist) {
      this.user.card = this.user.card || ERole[ERole.TRAINER];
      if (!this.showPassword) this.user['password'] = this.user.card;
      this.http.post(REST_API.POST.user, this.user)
        .subscribe(result => this.onResult(result));
    } else {
      this.http.put(REST_API.PUT.user, this.user)
        .subscribe(result => this.onResult(result));
    }
  }

  private onResult(response) {
    if (ERestResult[ERestResult.OK] === response.result) {
      if (!this.isBack) return;
      this.common.profile = null;
      this.location.back();
    } else {
      alert('Something wrong.');
      console.error(response);
    }
  }
}
