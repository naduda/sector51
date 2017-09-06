import { Component, OnInit } from '@angular/core';
import { NgModel } from "@angular/forms/src/forms";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../../services/common.service";
import { Profile } from "app/entities/profile";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sector51-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public roles: string[];
  public user: Profile;

  constructor(private http: HttpClient, private common: CommonService) { 
    this.http.get<string[]>('/api/getRoles').subscribe(data => {
      this.roles = data;
      this.user = new Profile();
      if (this.roles && this.roles.length > 0) {
        this.user.authorities = this.roles[0];
      }
    });
  }

  ngOnInit() {
    this.common.sidenavVisible = false;
  }

  changePassword(value: string, isRepeat: boolean) {
    this.user[isRepeat ? 'password2' : 'password'] = value;
    console.log(this.user);
  }

  changeRole(role: string) {
    const pos = this.user.authorities.indexOf(role);
    if (pos < 0) {
      this.user.authorities += ',' + role;
    } else {
      this.user.authorities = this.user.authorities.substring(0, pos) + this.user.authorities.substring(pos + role.length);
    }
    this.user.authorities = this.user.authorities.replace(',,', ',');
    if (this.user.authorities.startsWith(',')) {
      this.user.authorities = this.user.authorities.substring(1);
    }
    if (this.user.authorities.endsWith(',')) {
      this.user.authorities = this.user.authorities.substring(0, this.user.authorities.length - 1);
    }
  }

  validate(psw2: NgModel) {
    if (this.user.password !== this.user['password2']) {
      psw2.control.setValue('');
    }
    
    return this.user.password === this.user['password2'] && this.user.authorities.length > 0;
  }

  onSubmit() {
    this.user['roles'] = this.user.authorities;
    console.log(this.user);
    this.http.post('/api/createUser', this.user)
      .subscribe(data => console.log(data), err => console.error(err));
  }

  cancel(event) {
    console.log(event);
    let beers = [
      {name: "Stella", country: "Belgium", price: 9.50},
      {name: "Sam Adams", country: "USA", price: 8.50},
      {name: "Bud Light", country: "USA", price: 6.50},
      {name: "Brooklyn Lager", country: "USA", price: 8.00},
      {name: "Sapporo", country: "Japan", price: 7.50}
    ];
     
    Observable.from(beers)   // <1>
      .filter(beer => beer.price < 8)   // <2>
      .map(beer => beer.name + ": $" + beer.price) // <3>
      .subscribe(    // <4>
          beer => console.log(beer),
          err => console.error(err),
          () => console.log("Streaming is over")
    );
  }

}
