import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgModel } from '@angular/forms/src/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../../services/common.service';
import { Profile } from '../../entities/profile';
import { IRole, ERole, ESex, ERestResult, IService, IUserService, IResponse } from '../../entities/common';
import { of } from 'rxjs/observable/of';
import { REST_API } from '../../entities/rest-api';
import { ModalService } from '../../services/modal.service';
import { AbonementComponent } from '../modal/abonement/abonement.component';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  allRoles: IRole[];
  created: boolean;
  user: Profile;
  service: IService;
  userServices: IUserService[];
  cardRedonly: boolean;
  usersNotExist: boolean;
  buttonText: string;
  private idUser: number;

  constructor(private http: HttpClient, private location: Location,
              private route: ActivatedRoute, public common: CommonService,
              private modalService: ModalService) {
    this.service = this.common.services ? this.common.services[0] : undefined;
    this.userServices = [];
    this.buttonText = 'create';
  }

  ngOnInit() {
    let code;
    this.route.params
      .do(params => this.idUser = params['idUser'] || -1)
      .flatMap(params => this.route.queryParams)
      .do(queryParams => code = queryParams['code'] || '')
      .flatMap(params => this.http.get<boolean>(REST_API.GET.usersNotExist))
      .do(usersNotExist => this.usersNotExist = usersNotExist)
      .flatMap(usersNotExist => usersNotExist ?
        of(null) : this.http.get<Profile>(REST_API.GET.userById(this.idUser)).catch(e => of(null)))
      .do((user: Profile) => {
        if (!user) {
          user = new Profile();
          this.created = true;
        } else {
          user.email = user.email.toLowerCase();
          user.authorities = user['roles'];
        }
        user.sex = user['sex'] === true ? ESex.MAN : ESex.WOMAN;
        user.card = code || user.card;
        this.cardRedonly = code;
        this.user = user;
        this.allRoles = this.common.profile ? this.common.profile['iroles'] : null;
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
      })
      .flatMap(pairs => this.http.get<IResponse>(REST_API.GET.userServices(this.idUser)))
      .do((response: IResponse) => {
        if (ERestResult[ERestResult.OK] === response.result) {
          this.userServices = response.message;
        }
      })
      .flatMap(services => this.http.get<Profile[]>(REST_API.GET.users))
      .subscribe(users => {
        this.buttonText = this.user.name ? 'update' : 'create';
        this.user['password'] = this.user['password2'] = '';
      });
  }

  parseDate(dateString: string): Date {
    return dateString ? new Date(dateString) : null;
  }

  get isTrainer() {
    return this.user.authorities !== ERole[ERole.TRAINER];
  }

  get showPassword() {
    const auth = this.user.authorities;
    return auth === ERole[ERole.OWNER] || auth === ERole[ERole.ADMIN];
  }

  get genders() {
    return [ ESex.MAN, ESex.WOMAN ];
  }

  genderText(sex: ESex): string {
    return ESex[sex];
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
    if (this.user['password'] && this.user['password'].length === 0) {
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
      this.common.profile = null;
      this.location.back();
    } else {
      alert('Something wrong.');
      console.error(response);
    }
  }
}
