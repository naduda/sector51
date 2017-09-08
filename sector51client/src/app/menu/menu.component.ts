import { Component, OnInit, Input } from '@angular/core';
import { Profile } from "../entities/profile";
import { LangService } from 'prNgCommon/lang/lang.service';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input('user') currentUser: Profile;
  public permitions: number[];

  constructor(public lang: LangService) {
    //console.log(common.currentUser['roles'].toLowerCase().includes('owner'))
  }

  ngOnInit() {
    this.permitions = this.currentUser['permitions'];
    if (!this.permitions) {
      this.permitions = [];
    }
  }
}
