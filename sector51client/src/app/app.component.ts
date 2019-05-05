import { Component, OnInit } from '@angular/core';
import { AutoSubscription } from './common/auto-subscription';
import { TranslateService } from './common/services/translate-service';

@Component({
  selector: 'sector-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AutoSubscription implements OnInit {
  loaded: boolean;

  constructor(private translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.translateService.translation('en')
      .subscribe(() => this.loaded = true);
  }
}
