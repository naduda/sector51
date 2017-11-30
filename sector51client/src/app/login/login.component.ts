import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Profile } from '../entities/profile';
import { environment } from '../../environments/environment.responsive';

@Component({
  selector: 'sector51-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.logout();
    if (!environment.production) {
      this.model.username = 'owner@gmail.com';
      this.model.password = 'owner';
    }
  }

  login() {
    this.loading = true;
    this.auth.login(this.model.username, this.model.password)
    .subscribe(result => {
      if (result === true) {
        this.auth.navigate('main');
      } else {
        this.error = 'login.error.incorrectLogin';
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
