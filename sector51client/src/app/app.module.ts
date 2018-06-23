import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { Sector51RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AbonementDialogComponent } from './components/dialogs/abonement-dialog/abonement-dialog.component';
import { BarcodeDialogComponent } from './components/dialogs/barcode-dialog/barcode-dialog.component';
import { ProductDialogComponent } from './components/dialogs/product-dialog/product-dialog.component';
import { UserServicesComponent } from './components/user-services/user-services.component';
import { FocusDirective } from './directives/focus.directive';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { BoxesComponent } from './pages/boxes/boxes.component';
import { CartComponent } from './pages/cart/cart.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ExportComponent } from './pages/export/export.component';
import { ImportComponent } from './pages/import/import.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProductsComponent } from './pages/products/products.component';
import { MainReportComponent } from './pages/report/main-report/main-report.component';
import { ServicesComponent } from './pages/services/services.component';
import { SortusersPipe } from './pipes/sortusers.pipe';
import { CanActivateAuthGuard } from './services/auth-guard.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthenticationService } from './services/authentication.service';
import { CommonService } from './services/common.service';
import { GoogleSheetsService } from './services/google-sheets.service';
import { WebsocketService } from './services/websocket.service';
import { ToolbarComponent } from './toolbar/toolbar.component';

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
    ProductsComponent,
    FocusDirective,
    CartComponent,
    BoxesComponent,
    ServicesComponent,
    MainReportComponent,
    UserServicesComponent,
    ImportComponent,
    ExportComponent,
    SortusersPipe,
    NotificationsComponent,
    AbonementDialogComponent,
    BarcodeDialogComponent,
    ProductDialogComponent,
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
    DropdownModule,
    ConfirmDialogModule,
    GrowlModule,
    ContextMenuModule,
    Sector51RoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CanActivateAuthGuard,
    AuthenticationService,
    CommonService,
    WebsocketService,
    ConfirmationService,
    MessageService,
    GoogleSheetsService
  ],
  bootstrap: [AppComponent]
})
export class Sector51Module { }
