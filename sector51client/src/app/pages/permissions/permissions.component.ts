import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../../entities/profile';

@Component({
  selector: 'sector51-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  public user: Profile;
  private idUser: number;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .do(params => this.idUser = +params['idUser'])
      .flatMap(params => this.http.get<Profile>('/api/getUserById/' + this.idUser))
      .subscribe(user => this.user = user);
  }
}
