import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { ILocale, STORAGE_NAME } from './entities/common';

@Component({
  selector: 'sector51-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  locales: ILocale[];
  currentLang: string;

  constructor(public common: CommonService, private translate: TranslateService) {
    const sector = localStorage.getItem('sector');
    const locale = sector ? JSON.parse(sector).locale : undefined;
    this.currentLang = locale ? locale.name : 'en';
    translate.setDefaultLang(this.currentLang);
    translate.use(this.currentLang);
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

  onLangChange(lang: string) {
    this.translate.use(lang);
  }
}
