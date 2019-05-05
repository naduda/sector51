import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class AutoSubscription implements OnDestroy {
  protected subscription: Subscription;
  protected translation: any;

  ngOnDestroy(): void {
    console.log('destroy');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
