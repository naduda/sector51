import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../entities/profile';
import { LangService } from 'prNgCommon/lang/lang.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;

  constructor(public lang: LangService, translate: TranslateService) {}

  ngOnInit() {}
}
