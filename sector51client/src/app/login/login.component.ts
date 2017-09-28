import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'prNgCommon/lang/lang.service';
import { AuthenticationService } from '../services/authentication.service';
import { Profile } from '../entities/profile';

@Component({
  selector: 'sector51-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(public lang: LangService, translate: TranslateService,
    private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.logout();
    this.model.username = 'owner';
    this.model.password = 'owner';
  }

  login() {
    this.loading = true;
    this.auth.login(this.model.username, this.model.password)
    .subscribe(result => {
      if (result === true) {
        this.auth.navigate('main');
      } else {
        this.error = 'Username or password is incorrect';
        this.loading = false;
      }
    }, error => {
      console.log(error);
      if (error.ok) {
        this.loading = false;
        this.error = error;
      }
    });
  }
}
