import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { WebsocketService } from '../services/websocket.service';
import { Profile } from '../entities/profile';
import { ILocale } from '../entities/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'sector51-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() locales: ILocale[];
  @Input() currentLang: string;
  @Output() onLangChange: EventEmitter<string>;
  locale: ILocale;
  user: Profile;
  private subscription: Subscription;

  constructor(public auth: AuthenticationService,
              public common: CommonService) {
    this.onLangChange = new EventEmitter();
    this.subscription = common.user.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.locale = this.locales.find(l => l.name === this.currentLang);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeLang(locale: ILocale) {
    this.onLangChange.emit(locale.name);
    this.locale = locale;
  }
}
