import { Observable } from 'rxjs/Observable';
import { ILocale } from '../entities/common';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent } from '@ngx-translate/core';

export class TranslateServiceStub {
  static stabLocales: ILocale[] = [
    { name: 'uk', text: 'Українська', ico: './assets/images/ukFlag.png' },
    { name: 'ru', text: 'Русский', ico: './assets/images/ruFlag.png' },
    { name: 'en', text: 'English', ico: './assets/images/enFlag.png' }
  ];

  setDefaultLang(lang: string): void {}

  use(lang: string): Observable<any> {
    return Observable.of({});
  }

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of(TranslateServiceStub.stabLocales);
  }

  get onLangChange(): EventEmitter<LangChangeEvent> {
    return new EventEmitter<LangChangeEvent>();
  }

  get currentLang(): string {
    return 'en';
  }
}
