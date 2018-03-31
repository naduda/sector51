import { Component, OnInit, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Profile } from '../entities/profile';
import { REST_API } from '../entities/rest-api';

@Component({
  selector: 'sector51-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error: string;
  usersNotExist: boolean;

  constructor(private auth: AuthenticationService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<boolean>(REST_API.GET.usersNotExist).subscribe(response => this.usersNotExist = response);
    this.auth.logout();
    if (isDevMode()) {
      this.model.username = 'owner@gmail.com';
      this.model.password = 'owner';
    }
  }

  login() {
    this.loading = true;
    this.auth.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.auth.common.navigate('main');
        } else {
          this.loading = false;
        }
        this.error = result === true ? '' : 'login.error.incorrectLogin';
      }, error => {
        console.log(error);
        this.loading = false;
        this.error = error.statusText || error;
      });
  }
}
