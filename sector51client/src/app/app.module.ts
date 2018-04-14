import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Sector51RoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

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
import { BoxesComponent } from './pages/boxes/boxes.component';
import { BoxtypeComponent } from './pages/modal/boxtype/boxtype.component';
import { AbonementComponent } from './pages/modal/abonement/abonement.component';
import { ServicesComponent } from './pages/services/services.component';
import { MainReportComponent } from './pages/report/main-report/main-report.component';
import { UserServicesComponent } from './components/user-services/user-services.component';
import { ComboComponent } from './components/combo/combo.component';
import { ImportComponent } from './pages/import/import.component';

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
    CartComponent,
    BoxesComponent,
    BoxtypeComponent,
    AbonementComponent,
    ServicesComponent,
    MainReportComponent,
    UserServicesComponent,
    ComboComponent,
    ImportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    TableModule,
    TabViewModule,
    TooltipModule,
    CalendarModule,
    MultiSelectModule,
    Sector51RoutingModule
  ],
  entryComponents: [
    ModalComponent,
    AbonementComponent,
    BarcodeComponent,
    BoxtypeComponent,
  ],
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
