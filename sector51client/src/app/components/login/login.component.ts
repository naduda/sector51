import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/common/auth/auth-service.service';

@Component({
  selector: 'sector-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.name = 'test';
    this.password = 'test';
  }

  login() {
    console.log(`${this.name} - ${this.password}`);
    this.authService.login(this.name, this.password).subscribe();
  }
}
