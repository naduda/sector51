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
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.name = 'test';
    this.password = 'test';

    this.subscription = this.translateService.translationSubject
      .subscribe(response => this.translation = response);
  }

  login() {
    this.authService.login(this.name, this.password).subscribe();
  }
}
