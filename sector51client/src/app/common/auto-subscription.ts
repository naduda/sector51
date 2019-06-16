import { OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from './services/translate-service';

export class AutoSubscription implements OnInit, OnDestroy {
  protected subscription: Subscription;
  private translationSubscription: Subscription;
  translation: any;

  constructor(protected translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.translationSubscription = this.translateService.translationSubject
      .subscribe(response => this.translation = response);
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
    this.translationSubscription && this.translationSubscription.unsubscribe();
  }
}
