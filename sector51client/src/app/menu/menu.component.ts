import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ERole, IUserService } from '../entities/common';
import { Profile } from '../entities/profile';
import { REST_API } from '../entities/rest-api';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;
  public permissions: boolean;
  activeUsers: number;

  constructor(private http: HttpClient, private common: CommonService) { }

  ngOnInit() {
    this.permissions = this.currentUser.role < ERole.USER;
    this.http.get<IUserService[]>(REST_API.GET.allUserServices).subscribe(services => {
      const curDate = new Date().getTime();
      this.activeUsers = this.common.users.filter(u => {
        let uServices = services.filter(s => s.idUser === u['created']);
        if (uServices.length < 1) return false;
        uServices = uServices.filter(s => +s.dtBeg <= curDate && curDate <= +s.dtEnd);
        return uServices.length > 0;
      }).length;
    });
  }

  get isOwner(): boolean {
    return this.currentUser.role === ERole.OWNER;
  }

  get allUsers() {
    return this.common.users.length;
  }
}
