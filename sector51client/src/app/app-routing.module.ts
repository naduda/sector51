import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdscaleGuardGuard } from './common/auth/adscale-guard.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AdscaleGuardGuard] },
  { path: 'users', loadChildren: './main/main.module#MainModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
