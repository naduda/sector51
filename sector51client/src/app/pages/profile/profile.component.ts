import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../../entities/profile';

@Component({
  selector: 'sector51-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: Profile;

  constructor(public location: Location, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const username = params['name'];
      this.setUser(username);
    });
  }

  private setUser(username: string): void {
    this.http
      .get<Profile>('/api/profile/' + username)
      .subscribe(profile => this.user = profile);
  }
}
