import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Profile } from "../entities/profile";
import { LangService } from 'prNgCommon/lang/lang.service';
import { CommonService } from "../services/common.service";

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input('user') currentUser: Profile;
  private permissions: number[];

  constructor(private http: HttpClient, public lang: LangService,
              public common: CommonService) {
    console.log(common.currentUser['roles'].toLowerCase().includes('owner'))
  }

  ngOnInit() {}
}

