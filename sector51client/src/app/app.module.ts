import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Sector51RoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonModule } from 'prNgCommon/common.module';
import { LangService } from 'prNgCommon/lang/lang.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

import { AuthenticationService } from './services/authentication.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { CanActivateAuthGuard } from './services/auth-guard.service';
import { ModalService } from './services/modal.service';
import { CommonService } from './services/common.service';
import { WebsocketService } from './services/websocket.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MenuComponent } from './menu/menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';
import { ModalComponent } from './pages/modal/modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ToolbarComponent,
    ProfileComponent,
    MenuComponent,
    CreateUserComponent,
    PermissionsComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    CommonModule,
    Sector51RoutingModule
  ],
  entryComponents: [ModalComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LangService,
    ModalService,
    CanActivateAuthGuard,
    AuthenticationService,
    CommonService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class Sector51Module { }
