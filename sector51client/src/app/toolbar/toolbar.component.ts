import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ILocale } from '../entities/common';

@Component({
  selector: 'sector51-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() locales: ILocale[];
  @Input() currentLang: string;
  @Output() langChange: EventEmitter<string>;
  locale: ILocale;

  constructor(public common: CommonService) {
    this.langChange = new EventEmitter();
  }

  ngOnInit() {
    this.locale = this.locales.find(l => l.name === this.currentLang);
  }

  changeLang(locale: ILocale) {
    this.langChange.emit(locale.name);
    this.locale = locale;
  }
}
