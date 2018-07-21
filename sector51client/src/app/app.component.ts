import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { EConfirmType, ILocale } from './entities/common';
import { REST_API } from './entities/rest-api';
import { CommonService } from './services/common.service';

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
  }

  isMessageType(confirmation: any): boolean {
    return confirmation.type === EConfirmType.YES || confirmation.type === EConfirmType.YES_NO;
  }

  onLangChange(lang: string) {
    this.translate.use(lang);
  }

  @HostListener('document:keypress', ['$event'])
  readBarcode(event: KeyboardEvent) {
    if (47 < event.keyCode && event.keyCode < 58) {
      this.barcode += event.key;
      let code = '';
      if (this.isBarcode(this.barcode, 13)) {
        code = this.barcode.substring(this.barcode.length - 13);
      } else if (this.isBarcode(this.barcode, 14)) {
        code = this.barcode.substring(this.barcode.length - 14);
      } else {
        return;
      }
      this.http.post(REST_API.POST.scanner(code), {})
        .subscribe(() => this.barcode = '');
    } else {
      this.barcode = '';
    }
  }

  private isBarcode(code: string, numCount: number): boolean {
    if (code.length < numCount) return false;
    code = code.substring(code.length - numCount);
    let sum1 = 0;
    let sum2 = 0;
    const digit = +code[numCount - 1];

    for (let i = 0; i < numCount - 1; i++) {
      if (i % 2 === 0)
        sum1 += +code[i];
      else
        sum2 += +code[i];
    }

    if (numCount === 13) {
      sum1 += sum2 * 3;
      sum1 %= 10;
      return sum1 + digit === 10;
    } else {
      sum2 += sum1 * 3;
      sum2 %= 10;
      return sum2 + digit === 10;
    }
  }
}
