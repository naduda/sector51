import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../entities/profile';

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentUser: Profile;

  constructor() {}

  ngOnInit() {}
}
