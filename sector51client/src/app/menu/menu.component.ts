import { Component, Input, OnInit } from '@angular/core';
import { ERole } from '../entities/common';
import { Profile } from '../entities/profile';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;
  public permissions: boolean;

  constructor() { }

  ngOnInit() {
    this.permissions = this.currentUser.role < ERole.USER;
  }

  get isOwner(): boolean {
    return this.currentUser.role === ERole.OWNER;
  }
}
