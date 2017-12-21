import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../entities/profile';
import { ModalService } from '../services/modal.service';
import { BarcodeComponent } from '../pages/barcode/barcode.component';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;

  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  createProduct() {
    this.modalService.open(BarcodeComponent, { code: -1 });
  }
}
