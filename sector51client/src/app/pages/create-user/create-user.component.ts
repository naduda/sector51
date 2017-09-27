import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgModel } from '@angular/forms/src/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../../services/common.service';
import { Profile } from '../../entities/profile';
import { IRole, ERole } from '../../entities/common';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public roles: IRole[];
  public user: Profile;
  private idUser: number;

  constructor(private http: HttpClient, private location: Location,
              private route: ActivatedRoute, public common: CommonService) {
  }

  ngOnInit() {
    this.common.sidenavVisible = false;

    this.route.params
    .do(params => this.idUser = params['idUser'] === undefined ? -1 : +params['idUser'])
    .flatMap(params => this.http.get<Profile>('/api/getUserById/' + this.idUser))
    .do(user => {
      if (!user) {
        user = new Profile();
      } else {
        user.authorities = user['roles'];
      }
      this.user = user;
    })
    .do(user => this.roles = this.common.profile['iroles'])
    .subscribe(user => this.user['password'] = this.user['password2'] = '');
  }

  changePassword(value: string, isRepeat: boolean) {
    this.user[isRepeat ? 'password2' : 'password'] = value;
  }

  changeRole(role: string) {
    const pos = this.user.authorities.indexOf(role);
    if (pos < 0) {
      this.user.authorities += ',' + role;
    } else {
      this.user.authorities = this.user.authorities.substring(0, pos) + this.user.authorities.substring(pos + role.length);
    }
    this.user.authorities = this.user.authorities.replace(',,', ',');
    if (this.user.authorities.startsWith(',')) {
      this.user.authorities = this.user.authorities.substring(1);
    }
    if (this.user.authorities.endsWith(',')) {
      this.user.authorities = this.user.authorities.substring(0, this.user.authorities.length - 1);
    }
  }

  validate(psw2: NgModel) {
    if (this.user['password'] !== this.user['password2']) {
      psw2.control.setValue('');
    }
    return this.user['password'] === this.user['password2'] && this.user.authorities.length > 0;
  }

  onSubmit() {
    this.user['roles'] = this.user.authorities;
    if (this.user['password'].length === 0) {
      delete this.user['password'];
    }
    if (this.idUser < 0) {
      this.http.post('/api/createUser', this.user)
        .subscribe(data => this.location.back());
    } else {
      this.http.put('/api/updateUser', this.user)
      .subscribe(data => this.location.back());
    }
  }
}
