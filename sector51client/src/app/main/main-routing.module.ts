import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdscaleGuardGuard } from '../common/auth/adscale-guard.guard';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  {
    path: '', component: UserListComponent, canActivate: [AdscaleGuardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
