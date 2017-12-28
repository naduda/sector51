import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAuthGuard } from './services/auth-guard.service';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main',  component: MainComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'login',  component: LoginComponent },
  { path: 'registration', component: CreateUserComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'registration/:idUser', component: CreateUserComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [CanActivateAuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class Sector51RoutingModule {}
