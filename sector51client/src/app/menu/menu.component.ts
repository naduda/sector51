import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Profile } from "../entities/profile";
import { CommonService } from "../services/common.service";

@Component({
  selector: 'sector51-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input('user') currentUser: Profile;
  private permissions: number[];

  constructor(private http: HttpClient) {
    
  }

  ngOnInit() {
  }
}

