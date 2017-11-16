import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgModel } from '@angular/forms/src/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../../services/common.service';
import { Profile } from '../../entities/profile';
import { IRole, ERole, ESex } from '../../entities/common';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public allRoles: IRole[];
  public created: boolean;
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
        this.created = true;
      } else {
        user.authorities = user['roles'];
      }
      this.user = user;
      this.user.sex = user['sex'] === true ? ESex.MAN : ESex.WOMAN;
    })
    .do(user => this.allRoles = this.common.profile['iroles'])
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
      this.http.post('/api/createUser', this.user)
        .subscribe(data => this.location.back());
    } else {
      this.http.put('/api/updateUser', this.user)
        .subscribe(data => this.location.back());
    }
  }
}
