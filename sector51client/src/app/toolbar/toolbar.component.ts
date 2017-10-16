import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { WebsocketService } from '../services/websocket.service';
import { Profile } from '../entities/profile';
import { ILocale } from '../entities/common';

@Component({
  selector: 'sector51-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() locales: ILocale[];
  @Input() currentLang: string;
  @Output() onLangChange: EventEmitter<string>;
  locale: ILocale;

  constructor(public auth: AuthenticationService,
              public common: CommonService) {
    this.onLangChange = new EventEmitter();
  }

  ngOnInit() {
    this.locale = this.locales.find(l => l.name === this.currentLang);
  }

  changeLang(locale: ILocale) {
    this.onLangChange.emit(locale.name);
    this.locale = locale;
  }
}
