import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgModel } from '@angular/forms/src/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../../services/common.service';
import { Profile } from '../../entities/profile';
import { IRole, ERole, ESex, ERestResult } from '../../entities/common';
import { of } from 'rxjs/observable/of';
import { REST_API } from '../../entities/rest-api';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public allRoles: IRole[];
  public created: boolean;
  public user: Profile;
  public cardRedonly: boolean;
  private idUser: number;

  constructor(private http: HttpClient, private location: Location,
              private route: ActivatedRoute, public common: CommonService) {
  }

  ngOnInit() {
    let code;
    this.route.params
      .do(params => this.idUser = params['idUser'] || -1)
      .flatMap(params => this.route.queryParams)
      .do(queryParams => code = queryParams['code'] || '')
      .flatMap(params => this.http.get<Profile>(REST_API.GET.userById(this.idUser)).catch(e => of(null)))
      .do(user => {
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
        this.allRoles = this.common.profile['iroles'];
      })
      .subscribe(user => this.user['password'] = this.user['password2'] = '');
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
    if (this.user['password'].length === 0) {
      delete this.user['password'];
    }
    if (this.idUser < 0) {
      this.http.post(REST_API.POST.user, this.user)
        .subscribe(result => this.onResult(result));
    } else {
      this.http.put(REST_API.PUT.user, this.user)
        .subscribe(result => this.onResult(result));
    }
  }

  private onResult(response) {
    if (ERestResult[ERestResult.OK] === response.result) {
      this.location.back();
    } else {
      alert('Something wrong.');
      console.error(response);
    }
  }
}
