import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { BoxesComponent } from './pages/boxes/boxes.component';
import { CartComponent } from './pages/cart/cart.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ExportComponent } from './pages/export/export.component';
import { ImportComponent } from './pages/import/import.component';
import { ProductsComponent } from './pages/products/products.component';
import { MainReportComponent } from './pages/report/main-report/main-report.component';
import { ServicesComponent } from './pages/services/services.component';
import { CanActivateAuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: CreateUserComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'registration/:idUser', component: CreateUserComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'boxes', component: BoxesComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'main-report', component: MainReportComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'import', component: ImportComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'export', component: ExportComponent, canActivate: [CanActivateAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class Sector51RoutingModule { }
