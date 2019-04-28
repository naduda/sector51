import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SectorCommonModule } from '../common/common.module';
import { MainRoutingModule } from './main-routing.module';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    SectorCommonModule.forRoot(),
  ]
})
export class MainModule { }
