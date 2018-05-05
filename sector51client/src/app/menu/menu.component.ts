import { Component, Input, OnInit } from '@angular/core';
import { ERole } from '../entities/common';
import { Profile } from '../entities/profile';
import { BarcodeComponent } from '../pages/barcode/barcode.component';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;
  public permissions: boolean;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.permissions = this.currentUser.role < ERole.USER;
  }

  get isOwner(): boolean {
    return this.currentUser.role === ERole.OWNER;
  }

  createProduct() {
    this.modalService.open(BarcodeComponent, { code: -1 });
  }
}
