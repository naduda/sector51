import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'sector51',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public auth: AuthenticationService,
    public common: CommonService){}
}
