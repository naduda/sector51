import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/common/auth/auth-service.service';

@Component({
  selector: 'sector-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}
