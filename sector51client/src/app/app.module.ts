import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Sector51RoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';

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
import { MenuComponent } from './menu/menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ModalComponent } from './pages/modal/modal.component';
import { BarcodeComponent } from './pages/barcode/barcode.component';
import { ProductsComponent } from './pages/products/products.component';
import { FocusDirective } from './directives/focus.directive';
import { CartComponent } from './pages/cart/cart.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ToolbarComponent,
    MenuComponent,
    CreateUserComponent,
    ModalComponent,
    BarcodeComponent,
    ProductsComponent,
    FocusDirective,
    CartComponent
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
    AngularSplitModule,
    Sector51RoutingModule
  ],
  entryComponents: [ModalComponent, BarcodeComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ModalService,
    CanActivateAuthGuard,
    AuthenticationService,
    CommonService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class Sector51Module { }
