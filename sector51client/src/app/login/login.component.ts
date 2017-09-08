import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'prNgCommon/lang/lang.service';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from "../services/common.service";

@Component({
  selector: 'sector51-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(public lang: LangService,
    private router: Router,
    private common: CommonService,
    private auth: AuthenticationService) { }

  ngOnInit() {
    this.common.currentUser = null;
    this.auth.logout();
  }

  login() {
    this.loading = true;
    this.auth.login(this.model.username, this.model.password)
    .subscribe(result => {
      if (result === true) {
        this.router.navigate(['main']);
      } else {
        this.error = 'Username or password is incorrect';
        this.loading = false;
      }
    }, error => {
      console.log(error);
      this.loading = false;
      this.error = error;
    });
  }
}
