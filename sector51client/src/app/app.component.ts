import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { ILocale, STORAGE_NAME } from 'app/entities/common';

@Component({
  selector: 'sector51-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  locales: ILocale[];

  constructor(public common: CommonService, public translate: TranslateService) {
    const sector = localStorage.getItem('sector');
    const locale = sector ? JSON.parse(sector).locale : undefined;
    const localeName = locale ? locale.name : 'en';
    translate.setDefaultLang(localeName);
    translate.use(localeName);
    translate.onLangChange.subscribe((e: LangChangeEvent) => {
      const key: any = localStorage.getItem(STORAGE_NAME);
      const value = key ? JSON.parse(key) : new Object();
      value.locale = e.translations.locale.find(l => l.name === e.lang);
      localStorage.setItem(STORAGE_NAME, JSON.stringify(value));
    });
  }

  ngOnInit(): void {
    this.translate.get('locale')
      .subscribe(locales => this.locales = locales);
  }
}
