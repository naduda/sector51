import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ErrorInterceptor } from './auth/error.interceptor';
import { JwtInterceptor } from './auth/jwt-interceptor';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { TranslateService } from './services/translate-service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
  ]
})
export class SectorCommonModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SectorCommonModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        CanDeactivateGuard,
        TranslateService,

        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: AuthFakeBackendInterceptor,
        //   multi: true
        // }
      ]
    };
  }

}
