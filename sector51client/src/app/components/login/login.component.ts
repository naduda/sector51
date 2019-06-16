import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/common/auth/auth-service.service';
import { AutoSubscription } from 'src/app/common/auto-subscription';
import { TranslateService } from 'src/app/common/services/translate-service';

@Component({
  selector: 'sector-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AutoSubscription implements OnInit {
  name: string;
  password: string;

  constructor(
    private authService: AuthenticationService,
    translateService: TranslateService
  ) {
    super(translateService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.name = 'test';
    this.password = 'test';
  }

  login() {
    this.authService.login(this.name, this.password).subscribe();
  }

  signup() {
    // this.authService.signup(this.name, this.password).subscribe();
  }
}
