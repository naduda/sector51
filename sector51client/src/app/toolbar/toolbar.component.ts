import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { LangService } from 'prNgCommon/lang/lang.service';
import { CommonService } from '../services/common.service';
import { WebsocketService } from '../services/websocket.service';
import { Profile } from '../entities/profile';
import { Subscription } from 'rxjs/Subscription';
import { ILocale } from 'app/entities/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sector51-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() locales: ILocale[];
  locale: ILocale;
  public user: Profile;
  private subscription: Subscription;

  constructor(public auth: AuthenticationService,
              public lang: LangService,
              private translate: TranslateService,
              public common: CommonService) {
    this.subscription = common.user.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.locale = this.locales.find(l => l.name === this.translate.currentLang);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeLang(locale: ILocale) {
    this.translate.use(locale.name);
    this.locale = locale;
  }
}
