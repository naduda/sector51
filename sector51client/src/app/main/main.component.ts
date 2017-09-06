import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { LangService } from 'prNgCommon/lang/lang.service';
import { Profile } from "app/entities/profile";

@Component({
  selector: 'sector51-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public user: Profile;
  public users: Profile[];

  constructor(private auth: AuthenticationService,
              private common: CommonService,
              public lang: LangService) { 
    this.users = [];
  }

  ngOnInit() {
    this.common.user.subscribe(u => this.user = u);
    for(let i = 0; i < 50; i++) {
      const u = new Profile();
      u.name = 'User ' + i;
      u.surname = 'Surname ' + i;
      u['active'] = i % 5 === 0;
      this.users.push(u);
    }
  }
}
