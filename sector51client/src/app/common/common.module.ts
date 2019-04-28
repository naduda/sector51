import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdscaleInterceptor } from './auth/adscale-interceptor';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
  ]
})
export class SectorCommonModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SectorCommonModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AdscaleInterceptor, multi: true },
        CanDeactivateGuard
      ]
    };
  }

}
