import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { ILocale, STORAGE_NAME } from './entities/common';
import { HttpClient } from '@angular/common/http';
import { REST_API } from './entities/rest-api';

@Component({
  selector: 'sector51-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  locales: ILocale[];
  currentLang: string;
  private barcode: string;

  constructor(public common: CommonService, private translate: TranslateService, private http: HttpClient) {
    const locale = common.fromStorage('locale');
    this.currentLang = locale ? locale.name : 'en';
    translate.setDefaultLang(this.currentLang);
    translate.use(this.currentLang);
    translate.onLangChange.subscribe((e: LangChangeEvent) =>
      common.toStorage('locale', e.translations.locale.find(l => l.name === e.lang)));
    this.barcode = '';
  }

  ngOnInit(): void {
    this.translate.get('locale')
      .subscribe(locales => this.locales = locales);
    document.onkeypress = (event) => this.readBarcode(event);
  }

  onLangChange(lang: string) {
    this.translate.use(lang);
  }

  readBarcode(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.barcode.length < 13) {
        this.barcode = '';
        return;
      }
      this.barcode = this.barcode.substring(this.barcode.length - 13);
      this.http.post(REST_API.POST.scanner(this.barcode), {})
          .subscribe(response => this.barcode = '');
    } else if (47 < event.keyCode && event.keyCode < 58) {
      this.barcode += event.key;
    } else {
      this.barcode = '';
    }
  }
}
