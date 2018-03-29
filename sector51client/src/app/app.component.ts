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
    const locale = common.fromStorage('locale');
    this.currentLang = locale ? locale.name : 'en';
    translate.setDefaultLang(this.currentLang);
    translate.use(this.currentLang);
    translate.onLangChange.subscribe((e: LangChangeEvent) =>
      common.toStorage('locale', e.translations.locale.find(l => l.name === e.lang)));
  }

  ngOnInit(): void {
    this.translate.get('locale')
      .subscribe(locales => this.locales = locales);
    document.onkeypress = (event) => console.log(event);
  }

  onLangChange(lang: string) {
    this.translate.use(lang);
  }
}
