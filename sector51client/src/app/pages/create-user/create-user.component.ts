import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(private common: CommonService) { }

  ngOnInit() {
    this.common.sidenavVisible = false;
  }

}
