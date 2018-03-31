import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../entities/profile';
import { ModalService } from '../services/modal.service';
import { BarcodeComponent } from '../pages/barcode/barcode.component';
import { CommonService } from '../services/common.service';
import { ERole } from '../entities/common';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;
  public permissions: boolean;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.permissions = this.currentUser.role < ERole.USER;
  }

  createProduct() {
    this.modalService.open(BarcodeComponent, { code: -1 });
  }
}
